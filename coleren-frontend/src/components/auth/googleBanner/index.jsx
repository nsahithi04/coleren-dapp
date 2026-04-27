import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { loginWithGoogle } from "@/services/authService";
import { setUser } from "@/store/userSlice";
import { login } from "@/services/userService";

export default function GoogleButton({
  label = "Sign in for free with Google",
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let user = useSelector((state) => state.user);

  let handleGooglelogin = async () => {
    let response = await loginWithGoogle();
    const token = await response.user.getIdToken();
    console.log(token);
    console.log("from fire", response);

    if (response.isNewUser) {
      dispatch(
        setUser({
          fid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
          authToken: token,
          fromGoogle: true,
          isPendingOnboarding: true,
          isAuthenticated: true,
        }),
      );

      navigate("/signup-two");
    } else {
      const data = await login({}, token);
      console.log("Logged in:", data);

      await dispatch(
        setUser({
          fid: data.user.firebaseUid,
          uid: data.user._id,
          name: data.user.name,
          email: data.user.email,
          authToken: token,
          role: data.profile.jobTitle ?? null,
          teamSize: data.profile?.teamSize ?? null,
          workType: data.profile?.workType ?? null,
          subscribed: data.user.subscribed ?? false,
          fromGoogle: data.user.fromGoogle,
          isPendingOnboarding: !data.profile?.onboarding,
          isAuthenticated: true,
        }),
      );

      navigate("/success");
    }
  };

  return (
    <button
      onClick={handleGooglelogin}
      type="button"
      className="flex p-5 gap-3 bg-[#F8F8F8] items-center justify-center rounded-lg w-full"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M22.501 12.2331C22.501 11.3698 22.4296 10.7398 22.2748 10.0864H12.2153V13.983H18.12C18.001 14.9514 17.3582 16.4097 15.9296 17.3897L15.9096 17.5202L19.0902 19.9349L19.3106 19.9564C21.3343 18.1247 22.501 15.4297 22.501 12.2331Z"
          fill="#4285F4"
        />
        <path
          d="M12.2147 22.5001C15.1075 22.5001 17.536 21.5667 19.3099 19.9567L15.9289 17.39C15.0242 18.0083 13.8099 18.44 12.2147 18.44C9.38136 18.44 6.97663 16.6083 6.11941 14.0767L5.99376 14.0871L2.6865 16.5955L2.64325 16.7133C4.40513 20.1433 8.02417 22.5001 12.2147 22.5001Z"
          fill="#34A853"
        />
        <path
          d="M6.12003 14.0765C5.89385 13.4232 5.76295 12.7231 5.76295 11.9998C5.76295 11.2764 5.89385 10.5765 6.10813 9.92313L6.10214 9.78398L2.75343 7.23535L2.64387 7.28642C1.91771 8.70977 1.50104 10.3081 1.50104 11.9998C1.50104 13.6915 1.91771 15.2897 2.64387 16.7131L6.12003 14.0765Z"
          fill="#FBBC05"
        />
        <path
          d="M12.2147 5.55997C14.2266 5.55997 15.5837 6.41163 16.3576 7.12335L19.3814 4.23C17.5243 2.53834 15.1075 1.5 12.2147 1.5C8.0242 1.5 4.40514 3.85665 2.64325 7.28662L6.10753 9.92332C6.97665 7.39166 9.3814 5.55997 12.2147 5.55997Z"
          fill="#EB4335"
        />
      </svg>
      <p className="font-semibold text-lg text-[#555555]">{label}</p>
    </button>
  );
}
