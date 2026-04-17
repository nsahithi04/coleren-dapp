import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-3.png";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { isStrongPassword } from "@/utils/validation";
import {
  setName,
  setSubscribed,
  setUid,
  setfromGoogle,
} from "@/store/userSlice";
import { signupWithEmail } from "@/services/authService";

export default function SignupOne() {
  const [nameInput, setNameInput] = useState("");
  const [password, setPassword] = useState("");
  const [subscribedInput, setSubscribedInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nameInput.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, and a number.",
      );
      return;
    }

    setLoading(true);
    try {
      const { user } = await signupWithEmail(email, password);

      dispatch(setUid(user.uid));
      dispatch(setName(nameInput));
      dispatch(setSubscribed(subscribedInput));
      dispatch(setfromGoogle(false));

      navigate("/signup/step-two");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <div>
        <p className="text-4xl text-center font-semibold">
          Unlocking growth through actionable strategies
        </p>
        <p className="pt-4 text-center font-medium opacity-50">
          Add your name and password to create your account
        </p>
      </div>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-4">
        <div>
          <p className="text-sm font-medium pb-2">Full Name</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Jane Smith"
            className="w-full p-5 border border-[#A1A1A1] rounded-lg"
          />
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="opacity-50 text-sm">
          Your password must contain at least 8 characters, one lowercase
          letter, one uppercase letter and one number.
        </p>

        <label className="py-4 flex gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribedInput}
            onChange={(e) => setSubscribedInput(e.target.checked)}
            className="w-6 h-6 border-[#A1A1A1] accent-[#24BC61]"
          />
          <span className="opacity-50 text-sm">
            Send me insights, product news, offers and important updates via
            mail. I can unsubscribe at any time.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="text-center mt-4 text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Next Step"}
        </button>
      </form>
    </AuthLayout>
  );
}
