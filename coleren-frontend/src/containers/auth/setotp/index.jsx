import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-2.png";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { verifyOtp, sendResetEmail } from "@/services/authService";

const OTP_LENGTH = 6;

export default function SetOtp() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;
    const updated = [...otp];
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setOtp(updated);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)].focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (otp.some((d) => d === "")) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    const inputOtp = otp.join("");
    if (!verifyOtp(inputOtp)) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    navigate("/set-password", { state: { email } });
  };

  const handleResend = async () => {
    setError("");
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0].focus();
    await sendResetEmail(email);
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">
        Request sent successfully
      </p>

      <p className="text-center font-medium opacity-50">
        We've sent a 6-digit confirmation code to your email. Please enter the
        code below to verify your email.
      </p>

      {email && (
        <div className="text-center text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full">
          {email}
        </div>
      )}

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-8">
        <div className="flex gap-4 mx-auto">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              maxLength={1}
              inputMode="numeric"
              className={`max-w-[58px] text-center p-2 border rounded-lg text-[#114354] font-semibold text-4xl ${
                error ? "border-[#E94055]" : "border-[#CFCFCF]"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#25C766] rounded-lg w-full"
        >
          Submit
        </button>
      </form>

      <div className="text-center">
        <span className="opacity-50">Didn't receive code? </span>
        <span
          onClick={handleResend}
          className="text-[#25C766] font-semibold underline cursor-pointer"
        >
          Resend code
        </span>
      </div>

      <span
        onClick={() => navigate("/login")}
        className="text-[#062732] font-semibold underline cursor-pointer"
      >
        Back to Login
      </span>
    </AuthLayout>
  );
}
