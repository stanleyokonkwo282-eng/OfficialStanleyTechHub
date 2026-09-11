import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { auth, provider, hasFirebaseConfig } from "../../firebase.config";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    if (!auth || !hasFirebaseConfig) {
      setUser(null);
      setFirebaseUser(null);
      setIsUserLoading(false);
      return undefined;
    }

    const syncGoogleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result?.user?.email) return;

        await axios.post(`${import.meta.env.VITE_BASE_URL}/users`, {
          email: result.user.email,
          photoURL: result.user.photoURL,
          name: result.user.displayName,
        }).catch(() => undefined);
      } catch (error) {
        console.error("Google redirect sync failed:", error);
      }
    };

    syncGoogleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const dbUser = await fetchMongoUser(currentUser.email);
          // Backend GET /users/:email returns { success, data: {...} }.
          // Old code spread the whole envelope ({ success, data }) onto the
          // user object, which wiped role/points/referralCode and forced the
          // dashboard into a broken state right after login.
          const profile = dbUser?.data || dbUser || {};
          const mergedUser = {
            ...currentUser,
            ...profile,
            email: currentUser.email,
            displayName:
              currentUser.displayName || profile.name || profile.displayName || currentUser.email,
            photoURL: currentUser.photoURL || profile.photoURL || profile.image || null,
            role: profile.role || "student",
          };
          setUser(mergedUser);

          // Notify admin about user login (once per session)
          const justLoggedIn = sessionStorage.getItem("chub_justLoggedIn");
          if (justLoggedIn) {
            sessionStorage.removeItem("chub_justLoggedIn");
            try {
              await axios.post(
                `${import.meta.env.VITE_BASE_URL}/notifications/user-login`,
                {
                  name: mergedUser.displayName || mergedUser.name || currentUser.email,
                  email: currentUser.email,
                  phone: mergedUser.phone || "",
                  role: mergedUser.role || "student",
                  page: "dashboard",
                }
              );
            } catch (notifyErr) {
              console.error("Login notification failed:", notifyErr.message);
            }
          }
        } catch (error) {
          console.error("Failed to fetch Mongo user:", error);
          setUser(currentUser);
        } finally {
          setIsUserLoading(false);
        }
      } else {
        setUser(null);
        setIsUserLoading(false);
      }
    });
    return () => unsubscribe();
  }, []); // auth is stable and does not need to be a dependency

  const fetchMongoUser = async (email) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${encodeURIComponent(email)}`
    );
    return res.data;
  };

  const userSignup = (email, password) => {
    if (!auth || !hasFirebaseConfig) {
      return Promise.reject(new Error("Firebase authentication is not configured. Please set the VITE_FIREBASE_* environment variables."));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    if (!auth || !hasFirebaseConfig) {
      return Promise.reject(new Error("Firebase authentication is not configured. Please set the VITE_FIREBASE_* environment variables."));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    if (!auth || !provider || !hasFirebaseConfig) {
      return Promise.reject(new Error("Google sign-in is unavailable because Firebase authentication is not configured."));
    }

    provider.setCustomParameters({
      prompt: "select_account",
    });

    return signInWithRedirect(auth, provider);
  };

  const updateUserProfile = (user, name, photoURL) => {
    if (!auth || !hasFirebaseConfig) {
      return Promise.reject(new Error("Firebase authentication is not configured."));
    }
    return updateProfile(user, {
      displayName: name,
      photoURL: photoURL || null,
    });
  };

  const reloadAuthUser = useCallback(async () => {
    if (!auth?.currentUser) return null;
    try {
      await auth.currentUser.reload();
      const fresh = auth.currentUser;
      setFirebaseUser({ ...fresh });
      try {
        const dbUser = await fetchMongoUser(fresh.email);
        const profile = dbUser?.data || dbUser || {};
        const merged = {
          ...fresh,
          ...profile,
          email: fresh.email,
          displayName: fresh.displayName || profile.name || profile.displayName || fresh.email,
          photoURL: fresh.photoURL || profile.photoURL || profile.image || null,
          role: profile.role || "student",
        };
        setUser(merged);
        return merged;
      } catch {
        setUser({ ...fresh });
        return { ...fresh };
      }
    } catch (err) {
      console.error("Failed to reload auth user:", err?.message);
      return null;
    }
  }, []);

  const userLogout = useCallback(async () => {
    // Best-effort admin notification. It must NEVER block the actual logout:
    // a cold-started backend (Render free tier) or a slow SMTP server used to
    // keep this request pending for a long time, which made the Logout button
    // appear frozen/dead. Cap it at 4 seconds, then always sign out.
    try {
      if (user?.email && import.meta.env.VITE_BASE_URL) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/notifications/user-logout`,
          {
            name: user.displayName || user.name || user.email,
            email: user.email,
            phone: user.phone || "",
            role: user.role || "student",
          },
          { timeout: 4000 }
        );
      }
    } catch (notifyErr) {
      console.error("Logout notification failed:", notifyErr.message);
    }

    if (!auth || !hasFirebaseConfig) {
      window.location.href = "/login";
      return Promise.resolve();
    }
    try {
      await signOut(auth);
    } catch (signOutErr) {
      console.error("Firebase signOut failed:", signOutErr.message);
    }
    // Hard reload guarantees all React caches (auth context, react-query) reset,
    // so no UI ever remains "logged in" after logout.
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    return undefined;
  }, [user]);

  const authInfo = useMemo(
    () => ({
      user,
      setUser,
      firebaseUser,
      isUserLoading,
      userSignup,
      userLogin,
      userLogout,
      loginWithGoogle,
      updateUserProfile,
      reloadAuthUser,
    }),
    [user, firebaseUser, isUserLoading, userLogout, reloadAuthUser]
  );

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };