import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const dbUser = await fetchMongoUser(currentUser.email);
          const mergedUser = { ...currentUser, ...dbUser };
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
    return signInWithPopup(auth, provider);
  };

  const updateUserProfile = (user, name, photoURL) => {
    return updateProfile(user, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const userLogout = useCallback(async () => {
    try {
      if (user?.email) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/notifications/user-logout`,
          {
            name: user.displayName || user.name || user.email,
            email: user.email,
            phone: user.phone || "",
            role: user.role || "student",
          }
        );
      }
    } catch (notifyErr) {
      console.error("Logout notification failed:", notifyErr.message);
    }

    if (!auth || !hasFirebaseConfig) {
      return Promise.resolve();
    }
    return signOut(auth);
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
    }),
    [user, firebaseUser, isUserLoading, userLogout]
  );

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };