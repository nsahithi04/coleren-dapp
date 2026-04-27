import AuthLayout from "../../layout/authLayout";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-5.png";

import { verifyEmail } from "../../services/userService";
import { sendResetEmail } from "../../services/authService";
import { isValidEmail } from "@/utils/validation";

import ErrorShow from "../../components/auth/errorBanner";
import InputField from "../../components/auth/inputField";
import SuccessShow from "../../components/auth/successBanner";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  let handleSubmit = async () => {
    setError("");

    if (!email) {
      setError("please enter the email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("please enter a valid email");
      return;
    }

    try {
      let res = await verifyEmail({ email });

      if (!res.exists) {
        setError("email is not registered with us");
        return;
      }
      console.log("Email exists");
      await sendResetEmail(email);
      setSuccess("check your email for the link");
    } catch (err) {
      console.error("err", err);
      setError("Something went wrong");
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

      <ErrorShow error={error} />
      <SuccessShow success={success} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full grid gap-8"
      >
        <InputField
          label="Work Email"
          placeholder="sample@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />

        <button
          type="submit"
          className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#25C766] rounded-lg w-full disabled:opacity-50"
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
