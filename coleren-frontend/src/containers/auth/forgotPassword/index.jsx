import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";
import ErrorBanner from "@/components/auth/ErrorBanner";
import SuccessBanner from "@/components/auth/SuccessBanner";
import { isValidEmail } from "@/utils/validation";
import { checkEmailExists, sendResetEmail } from "@/services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setsuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendResetEmail(email);

      setsuccess(
        `If an account exists for ${email}, you will receive a password reset link.`,
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <SuccessBanner message={success} />

      <form onSubmit={handleSubmit} className="w-full grid gap-8">
        <div>
          <p
            className={`text-sm font-medium pb-2 ${error ? "text-[#E94055]" : ""}`}
          >
            Work Email
          </p>
          <div className="relative">
            <input
              placeholder="sample@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`w-full p-5 border rounded-lg ${
                error
                  ? "border-[#E94055]"
                  : success
                    ? "border-[#25C766]"
                    : "border-[#A1A1A1]"
              }`}
            />

            {/* ❌ Error Icon */}
            {error && (
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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

            {/* ✅ Success Icon */}
            {!error && success && (
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
                />
                <path
                  d="M7.75 12L10.58 14.83L16.25 9.17"
                  stroke="#25C766"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#25C766] rounded-lg w-full disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Request"}
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
