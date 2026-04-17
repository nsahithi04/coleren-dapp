import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-5.png";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";

export default function SignupSuccess() {
  const navigate = useNavigate();

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
        onClick={() => navigate("/GettingStarted")}
        className="text-center text-[#FFFFFF] font-semibold p-5 bg-[#24BC61] rounded-lg"
      >
        Get Started
      </button>
    </AuthLayout>
  );
}
