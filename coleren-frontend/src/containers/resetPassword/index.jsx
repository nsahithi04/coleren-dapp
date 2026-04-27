import AuthLayout from "../../layout/authLayout";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-5.png";

import { resetPassword } from "../../services/authService";
import { passwordsMatch, isStrongPassword } from "@/utils/validation";

import ErrorShow from "../../components/auth/errorBanner";
import PasswordField from "../../components/auth/passwordField";

export default function SetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const oobCode = params.get("oobCode");
  const mode = params.get("mode");

  console.log(oobCode, mode);

  let handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Please enter both passwords");
    } else if (!passwordsMatch(password, confirmPassword)) {
      setError("Passwords do not match");
    } else if (!isStrongPassword(confirmPassword)) {
      setError("Passwords is not strong");
    } else {
      try {
        await resetPassword(oobCode, confirmPassword);

        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
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

      <ErrorShow error={error} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full grid gap-4"
      >
        <PasswordField
          label="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={error}
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
