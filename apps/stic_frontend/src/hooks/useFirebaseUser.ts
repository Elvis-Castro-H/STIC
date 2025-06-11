'use client';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  GoogleAuthProvider,
  type User,
  signOut,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "../firebase/FirebaseConfig";

export const useFirebaseUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) return;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const loginWithFirebase = (email: string, password: string) => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error signing in:", error.code, error.message);
      });
  };

  const registerWithFirebase = (
    email: string,
    password: string,
    fullName: string
  ) => {
    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User registered:", user);

        return updateProfile(user, { displayName: fullName }).then(() => {
          console.log("Profile updated successfully");
          window.location.href = "/";
        });
      })
      .catch((error) => {
        console.error("Error registering:", error.code, error.message);
      });
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider)
      .then((result) => {
        console.log("User signed in with Google:", result.user);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error signing in with Google:", {
          errorCode: error.code,
          errorMessage: error.message,
          email: error.customData?.email,
          credential: GoogleAuthProvider.credentialFromError(error),
        });
      });
  };

  const logout = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("User signed out successfully");
        setUser(null);
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const linkWithPassword = (email: string, password: string) => {
    if (!user) return;

    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(user, credential)
      .then((usercred) => {
        console.log("Account linking success", usercred.user);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
  };

  return {
    user,
    loginWithFirebase,
    registerWithFirebase,
    loginWithGoogle,
    logout,
    linkWithPassword,
  };
};
