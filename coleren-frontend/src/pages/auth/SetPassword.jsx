import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-3.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { isStrongPassword, passwordsMatch } from "@/utils/validation";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, and a number.",
      );
      return;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      setError(
        "Passwords do not match. Please ensure both fields are identical.",
      );
      return;
    }

    navigate("/login");
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <div>
        <p className="text-4xl text-center font-semibold">Update password</p>
        <p className="pt-4 text-center font-medium opacity-50">
          Enter your new password below. Make sure it's strong and memorable.
        </p>
      </div>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-4">
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hasError={!!error}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          hasError={!!error}
        />
        <button
          type="submit"
          className="text-center mt-4 text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full"
        >
          Update Password
        </button>
      </form>
    </AuthLayout>
  );
}
