import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  confirmPasswordReset,
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

export const checkEmailExists = async (email) => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (err) {
    // if Firebase throws, email likely doesn't exist
    return false;
  }
};

export const sendResetEmail = (email) => sendPasswordResetEmail(auth, email);

export const resetPassword = (oobCode, newPassword) =>
  confirmPasswordReset(auth, oobCode, newPassword);

export const STATIC_OTP = "123456";

export const verifyOtp = (inputOtp) => inputOtp === STATIC_OTP;
