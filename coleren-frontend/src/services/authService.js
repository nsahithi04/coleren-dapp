import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import { auth } from "../../firebase";

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signupWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
  return { user: result.user, isNewUser };
};

export const signupWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
  return { user: result.user, isNewUser };
};
