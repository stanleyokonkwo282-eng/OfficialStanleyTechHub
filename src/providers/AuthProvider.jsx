import axios from "axios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
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
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users/${currentUser.email}`
          );
          const dbUser = res.data;
          setUser({ ...currentUser, ...dbUser });
        } catch (error) {
          console.error("Failed to fetch Mongo user:", error);
          // Still set user so PrivateRoute doesn't redirect to login
          setUser(currentUser);
        } finally {
          setIsUserLoading(false);
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        setIsUserLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array — only run once on mount

  const userSignup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const userLogin = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const loginWithGoogle = () => signInWithPopup(auth, provider);

  const updateUserProfile = (user, name, photoURL) =>
    updateProfile(user, { displayName: name, photoURL });

  const userLogout = () => signOut(auth);

  const authInfo = {
    user,
    setUser,
    firebaseUser,
    isUserLoading,
    userSignup,
    userLogin,
    userLogout,
    loginWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };