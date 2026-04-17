import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-1.png";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/userSlice";
import { persistor } from "@/store/store";
import AuthLayout from "@/layouts/auth/index";
import GoogleButton from "@/components/auth/GoogleButton";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { isValidEmail } from "@/utils/validation";
import { loginWithEmail, loginWithGoogle } from "@/services/authService";
import { getUser, getMyProfile } from "@/services/userService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus] = useState("idle");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailValid = isValidEmail(email);
  const passwordValid = password.length > 0;
  const resolved = loginStatus !== "idle";
  const showEmailError = resolved && (!emailValid || loginStatus === "failed");
  const showEmailSuccess = resolved && emailValid && loginStatus !== "failed";
  const showPasswordError =
    resolved && (!passwordValid || loginStatus === "failed");
  const showPasswordSuccess =
    resolved && passwordValid && loginStatus !== "failed";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoginStatus("idle");

    if (!emailValid) {
      setError("Please enter a valid email address.");
      setLoginStatus("failed");
      return;
    }
    if (!passwordValid) {
      setError("Please enter your password.");
      setLoginStatus("failed");
      return;
    }

    try {
      // Set rememberMe BEFORE dispatching so store.js picks it up correctly
      localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      // Purge old persisted state so it migrates to the correct storage
      await persistor.purge();

      const { user } = await loginWithEmail(email, password);
      const backendUser = await getUser();
      const backendProfile = await getMyProfile();

      if (!backendProfile) {
        navigate("/signup/step-two");
        return;
      }

      dispatch(
        setUser({
          uid: user.uid,
          name: backendUser.name,
          email: backendUser.email,
          fromGoogle: backendUser.fromGoogle,
          role: backendProfile.role,
          teamSize: backendProfile.teamSize,
          workType: backendProfile.workType,
          subscribed: backendProfile.subscribed,
        }),
      );

      // Flush ensures state is written to the correct storage before navigating
      await persistor.flush();

      navigate("/GettingStarted");
    } catch {
      setLoginStatus("failed");
      setError(
        "The email address and password you entered does not match our records.",
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user, isNewUser } = await loginWithGoogle();

      if (isNewUser) {
        await user.delete();
        navigate("/signup", {
          state: { error: "No account found. Please sign up first." },
        });
        return;
      }

      await user.getIdToken(true);
      const backendUser = await getUser();
      const backendProfile = await getMyProfile();

      // Google login always remembers (no checkbox) — set to true
      localStorage.setItem("rememberMe", "true");
      await persistor.purge();

      dispatch(
        setUser({
          uid: user.uid,
          name: backendUser.name,
          email: backendUser.email,
          fromGoogle: backendUser.fromGoogle,
          role: backendProfile.role,
          teamSize: backendProfile.teamSize,
          workType: backendProfile.workType,
          subscribed: backendProfile.subscribed,
        }),
      );

      await persistor.flush();

      navigate("/GettingStarted");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">
        Sign in to your account
      </p>

      <GoogleButton onClick={handleGoogleLogin} />

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 border-t border-[#CFCFCF]" />
        <p className="font-medium text-base text-[#555555] whitespace-nowrap">
          Or use work email
        </p>
        <div className="flex-1 border-t border-[#CFCFCF]" />
      </div>

      <ErrorBanner message={error} />

      <form onSubmit={handleLogin} className="w-full grid gap-8">
        <div>
          <p
            className={`text-sm font-medium pb-2 ${showEmailError ? "text-[#E94055]" : ""}`}
          >
            Work Email
          </p>
          <div className="relative">
            <input
              placeholder="sample@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginStatus("idle");
              }}
              type="email"
              className={`w-full p-5 pr-12 border rounded-lg ${
                showEmailError
                  ? "border-[#E94055]"
                  : showEmailSuccess
                    ? "border-[#25C766]"
                    : "border-[#A1A1A1]"
              }`}
            />
            {showEmailError && (
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="#D64750"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 7.15674L12 12.1567"
                  stroke="#D64750"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9945 16H12.0035"
                  stroke="#D64750"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {showEmailSuccess && (
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                  stroke="#25C766"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="#25C766"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginStatus("idle");
          }}
          hasError={showPasswordError}
          hasSuccess={showPasswordSuccess}
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
            onClick={() => navigate("/forgot-password")}
            type="button"
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
