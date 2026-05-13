import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-5.png";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { acceptInvite } from "../../services/teamService";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import AuthLayout from "../../layout/authLayout";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const navigate = useNavigate();

  let user = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        navigate(`/login`);

        return;
      }

      try {
        const token = await firebaseUser.getIdToken();

        console.log(inviteToken);

        await acceptInvite(inviteToken, token);
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <div>
        <p className="text-4xl text-center font-semibold">
          Welcome to the team!
        </p>
        <p className="pt-4 text-center font-medium opacity-50">
          you have succesfully joined the team on clicking the accept button.
          <br /> You can view and edit your team in profile .
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
