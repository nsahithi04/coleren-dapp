import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-1.png";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";
import GoogleButton from "@/components/auth/GoogleButton";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { signupWithGoogle } from "@/services/authService";
import { isValidEmail } from "@/utils/validation";
import { setUser, setEmail } from "@/store/userSlice";
import { createUser } from "@/services/userService";

export default function Signup() {
  const [emailInput, setEmailInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      const { user, isNewUser } = await signupWithGoogle();

      await createUser({
        name: user.displayName,
        email: user.email,
        fromGoogle: true,
      });

      if (isNewUser) {
        dispatch(
          setUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            fromGoogle: true,
            isPendingOnboarding: true,
          }),
        );
        navigate("/signup/step-two");
      } else {
        dispatch(
          setUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            fromGoogle: true,
          }),
        );
        navigate("/GettingStarted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(emailInput)) {
      setError("Please enter a valid work email.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Evaluation Agreement to continue.");
      return;
    }

    dispatch(setEmail(emailInput));
    navigate("/signup/step-one");
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">Create a new account</p>

      <GoogleButton
        onClick={handleGoogleSignup}
        label="Sign up for free with Google"
      />

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 border-t border-[#CFCFCF]" />
        <p className="font-medium text-base text-[#555555] whitespace-nowrap">
          Or use work email
        </p>
        <div className="flex-1 border-t border-[#CFCFCF]" />
      </div>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-4">
        <div>
          <p className="text-sm font-medium pb-2">Work Email</p>
          <input
            placeholder="sample@email.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            className="w-full p-5 border border-[#A1A1A1] rounded-lg"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 border-[#A1A1A1] accent-[#24BC61]"
          />
          <span className="text-sm font-medium">
            I agree to Coleren's{" "}
            <span className="text-[#24BC61] underline">
              Evaluation Agreement
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="text-center mt-4 text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full"
        >
          Sign Up for Free
        </button>
      </form>

      <div className="text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-[#062732] font-semibold underline cursor-pointer"
        >
          SIGN IN
        </span>
      </div>
    </AuthLayout>
  );
}
