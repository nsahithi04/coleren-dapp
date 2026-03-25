import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { isValidEmail } from "@/utils/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    navigate("/set-otp", { state: { email } });
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">
        Forgot your password?
      </p>

      <p className="text-center font-medium">
        Please enter the email address linked to your account and we'll email
        you a code to reset your password.
      </p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-8">
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

        <button
          type="submit"
          className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#25C766] rounded-lg w-full"
        >
          Send Request
        </button>
      </form>

      <span
        onClick={() => navigate("/login")}
        className="text-[#062732] font-semibold underline cursor-pointer"
      >
        Back to Login
      </span>
    </AuthLayout>
  );
}
