import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../layout/authLayout";
import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-1.png";

import { isValidEmail } from "../../utils/validation";
import {
  loginWithEmail,
  checkEmailExists,
  loginWithGoogle,
} from "../../services/authService";
import { setUser } from "@/store/userSlice";

import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

import { login, verifyEmail } from "../../services/userService";

import InputField from "../../components/auth/inputField";
import ErrorShow from "../../components/auth/errorBanner";
import PasswordField from "../../components/auth/passwordField";
import GoogleButton from "../../components/auth/googleBanner";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const logout = async () => {
      //await signOut(auth);
      console.log("Signed out on login page");
    };
    logout();
  }, []);

  let handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email) {
      setEmailError("Email is required");
      setGeneralError("Email is required");
      return;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      setGeneralError("Please enter a valid email address");
      return;
    } else if (!password) {
      setPasswordError("Please enter password");
      setGeneralError("Please enter password");
      return;
    }

    localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

    try {
      const { user } = await loginWithEmail(email, password);
      const token = await user.getIdToken();

      console.log(user.uid, user.email, token);

      const data = await login({}, token);

      console.log("Logged in:", data);

      dispatch(
        setUser({
          fid: data.user.firebaseUid,
          uid: data.user._id,
          name: data.user.name,
          email: data.user.email,
          authToken: token,
          role: data.profile.jobTitle ?? null,
          teamSize: data.profile?.teamSize ?? null,
          workType: data.profile?.workType ?? null,
          subscribed: data.user.subscribed ?? false,
          fromGoogle: data.user.fromGoogle,
          isAuthenticated: true,
          isPendingOnboarding: !data.profile?.onboarding,
        }),
      );

      if (data.onboarding) {
        setGeneralError("navigate to creating profile");
        navigate("/signup-two");
      }

      navigate("/success");
    } catch (err) {
      console.error("err", err);
      setEmailError("error");
      setPasswordError("error");

      const exists = await checkEmailExists(email);
      console.log(exists);

      if (exists) {
        setGeneralError("please enter the correct password");
      } else {
        setGeneralError(
          "The email address and password you entered does not match our records.",
        );
      }
    }
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">
        Sign in to your account
      </p>
      <GoogleButton />

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 border-t border-[#CFCFCF]" />
        <p className="font-medium text-base text-[#555555] whitespace-nowrap">
          Or use work email
        </p>
        <div className="flex-1 border-t border-[#CFCFCF]" />
      </div>
      <ErrorShow error={generalError} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
          console.log(email);
        }}
        className="w-full grid gap-8"
      >
        <InputField
          label="Work Email"
          placeholder="sample@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <PasswordField
          label="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#24BC61]"
            />
            <span className="text-sm text-[#A1A1A1]">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#114354] font-semibold underline"
          >
            Forgot Password
          </button>
        </div>
        <button
          type="submit"
          className="text-center text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full"
        >
          Let's Begin
        </button>
      </form>
      <div className="text-center">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-[#062732] font-semibold underline cursor-pointer"
        >
          SIGN UP FOR FREE
        </span>
      </div>
    </AuthLayout>
  );
}
