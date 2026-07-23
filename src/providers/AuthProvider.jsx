import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState, useMemo } from "react"; // 1. Added useMemo here
import { auth, provider } from "../../firebase.config";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        try {
          const dbUser = await fetchMongoUser(currentUser.email);
          setUser({ ...currentUser, ...dbUser });
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
  }, [auth]);

  const fetchMongoUser = async (email) => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/${email}`
    );

    return res.data;
  };

  const userSignup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, provider);
  };

  const updateUserProfile = (user, name, photoURL) => {
    return updateProfile(user, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const userLogout = () => {
    return signOut(auth);
  };

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
    [
      user,
      setUser,
      firebaseUser,
      isUserLoading,
      userSignup,
      userLogin,
      userLogout,
      loginWithGoogle,
      updateUserProfile,
    ]
  );

  // 2. Fixed syntax: Must be AuthContext.Provider
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };