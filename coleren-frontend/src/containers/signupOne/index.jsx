import AuthLayout from "../../layout/authLayout";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-3.png";

import { isStrongPassword } from "@/utils/validation";
import { setUser } from "@/store/userSlice";
import { signupWithEmail } from "../../services/authService";

import InputField from "../../components/auth/inputField";
import PasswordField from "../../components/auth/passwordField";
import ErrorShow from "../../components/auth/errorBanner";

export default function SignupOne() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let user = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passError, setPassError] = useState("");

  let handleSubmit = async () => {
    setError("");
    setNameError("");
    setPassError("");
    if (!name.trim() && !password.trim()) {
      setError("please enter your details");
      return;
    }

    if (!name.trim()) {
      setNameError("please enter your name");
      setError("please enter your name");
      return;
    }

    if (!isStrongPassword(password)) {
      setPassError("please enter a strong password");
      setError("please enter a strong password");
      return;
    }

    if (!user.email) {
      setError("Email missing. Restart signup.");
      navigate("/signup");
      return;
    }

    if (nameError || passError) return;

    try {
      let firebaseUid;
      let authData;

      authData = await signupWithEmail(user.email, password);
      const token = await authData.user.getIdToken();
      console.log(authData.user.uid, token);
      firebaseUid = authData.user.uid;

      dispatch(
        setUser({
          name: name,
          authToken: token,
          subscribed: subscribed,
          fid: firebaseUid,
          fromGoogle: false,
          isAuthenticated: true,
          isPendingOnboarding: true,
        }),
      );

      console.log("signup: ", user);

      navigate("/signup-two");
    } catch (err) {
      setError("Signup failed");
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

      <ErrorShow error={error} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          console.log(name);
        }}
        className="w-full grid gap-4"
      >
        <InputField
          label="Name"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          error={nameError}
        />

        <PasswordField
          label="Password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passError}
        />

        <p className="opacity-50 text-sm">
          Your password must contain at least 8 characters, one lowercase
          letter, one uppercase letter and one number.
        </p>

        <label className="py-4 flex gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribed}
            onChange={(e) => setSubscribed(e.target.checked)}
            className="w-6 h-6 border-[#A1A1A1] accent-[#24BC61]"
          />
          <span className="opacity-50 text-sm">
            Send me insights, product news, offers and important updates via
            mail. I can unsubscribe at any time.
          </span>
        </label>

        <button
          type="submit"
          className="text-center mt-4 text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full disabled:opacity-50"
        >
          Next Step
        </button>
      </form>
    </AuthLayout>
  );
}
