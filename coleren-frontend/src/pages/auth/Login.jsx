import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-1.png";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/userSlice";
import AuthLayout from "@/layouts/AuthLayout";
import GoogleButton from "@/components/auth/GoogleButton";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { isValidEmail } from "@/utils/validation";
import { loginWithEmail, loginWithGoogle } from "@/services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

      const { user } = await loginWithEmail(email, password);

      dispatch(
        setUser({
          uid: user.uid,
          name: user.displayName || "User",
          email: user.email,
        }),
      );

      navigate("/home");
    } catch {
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

      dispatch(
        setUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        }),
      );
      navigate("/home");
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
            className={`text-sm font-medium pb-2 ${error ? "text-[#E94055]" : ""}`}
          >
            Work Email
          </p>
          <input
            placeholder="sample@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className={`w-full p-5 border rounded-lg ${
              error ? "border-[#E94055]" : "border-[#A1A1A1]"
            }`}
          />
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasError={!!error}
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
