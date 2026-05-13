import AuthLayout from "../../layout/authLayout";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-2.png";

import { isValidEmail } from "@/utils/validation";
import { setUser } from "@/store/userSlice";
import { verifyEmail } from "@/services/userService";

import InputField from "../../components/auth/inputField";
import ErrorShow from "../../components/auth/errorBanner";
import GoogleButton from "../../components/auth/googleBanner";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [agreed, setAgreed] = useState(false);

  let handleSignup = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!agreed) {
      setEmailError("Please agree to coleren terms");
      return;
    }

    let res = await verifyEmail({ email });
    if (res.exists) {
      navigate("/login");
      return;
    }

    setEmailError("");
    console.log(email);
    dispatch(
      setUser({
        email: email,
        isPendingOnboarding: true,
        fromGoogle: false,
        inviteToken: inviteToken,
      }),
    );
    navigate("/signup-one");
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <p className="text-4xl text-center font-semibold">Create a new account</p>
      <GoogleButton />
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 border-t border-[#CFCFCF]" />
        <p className="font-medium text-base text-[#555555] whitespace-nowrap">
          Or use work email
        </p>
        <div className="flex-1 border-t border-[#CFCFCF]" />
      </div>

      <ErrorShow error={emailError} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
          console.log(email);
        }}
        className="w-full grid gap-4"
      >
        <InputField
          label="Work Email"
          placeholder="sample@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          error={emailError}
        />

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
          onClick={() => navigate("/login")}
          className="text-[#062732] font-semibold underline cursor-pointer"
        >
          SIGN IN
        </span>
      </div>
    </AuthLayout>
  );
}
