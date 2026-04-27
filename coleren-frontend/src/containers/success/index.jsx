import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-5.png";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AuthLayout from "../../layout/authLayout";

import { logoutUser } from "@/store/userSlice";

export default function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <div>
        <p className="text-4xl text-center font-semibold">You're all set!</p>
        <p className="pt-4 text-center font-medium opacity-50">
          Let's jump right into your sales and product analytics dashboard.
        </p>
      </div>

      <button
        onClick={() => {
          console.log("success");
          navigate("/gettingStarted");
        }}
        className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#24BC61] rounded-lg"
      >
        Get Started
      </button>
    </AuthLayout>
  );
}
