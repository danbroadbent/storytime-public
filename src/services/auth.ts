import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { createUser } from "./userData";

interface AuthState {
  currentUser: User | null;
  loading: boolean;
}

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (
  email: string,
  password: string,
  username: string
) => {
  const newUser = await createUserWithEmailAndPassword(auth, email, password);
  createUser(newUser.user.uid, username, email);
};

export const logOut = () => {
  return signOut(auth);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    loading: true,
    currentUser: null,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) =>
      setAuthState({ loading: false, currentUser: user })
    );
    return unsub;
  }, []);

  return authState;
};

export const AuthContext = React.createContext<AuthState>({
  currentUser: null,
  loading: true,
});

export function useAuthContext() {
  return useContext(AuthContext);
}
