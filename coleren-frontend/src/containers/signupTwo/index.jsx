import AuthLayout from "../../layout/authLayout";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import icon from "../../components/common/icons/icon-black.svg";
import hero from "../../components/auth/images/image-4.png";

import { setUser } from "@/store/userSlice";

import { signup } from "../../services/userService";

import ErrorShow from "../../components/auth/errorBanner";
import SelectField from "../../components/auth/selectField";

const WORK_TYPES = [
  "Engineering",
  "Sales",
  "Marketing",
  "Product",
  "Design",
  "Operations",
  "Other",
];
const TEAM_SIZES = ["1–5", "6–20", "21–50", "51–200", "200+"];
const ROLES = [
  "Founder / CEO",
  "Manager",
  "Individual Contributor",
  "Consultant",
  "Other",
];

export default function SignupTwo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("from signup-2: ", user);
  }, []);

  const [workType, setWorkType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  let handleSubmit = async () => {
    setError("");
    if (!workType || !teamSize || !role) {
      setError("fill out all the information");
      return;
    }

    console.log("user.fromGoogle", user.fromGoogle);

    try {
      const firebaseUid = user.fid;
      console.log("user", user);

      const backendData = await signup(
        {
          firebaseUid: firebaseUid,
          email: user.email,
          name: user.name,
          role,
          teamSize,
          workType,
          subscribed: user.subscribed,
          fromGoogle: user.fromGoogle,
        },
        user.authToken,
      );
      if (!backendData) {
        setError("Signup failed");
        return;
      }

      dispatch(
        setUser({
          role: role,
          teamSize: teamSize,
          workType: workType,
          isPendingOnboarding: false,
        }),
      );

      navigate("/success");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("err", err);
    }
  };

  return (
    <AuthLayout image={hero}>
      <img className="w-[222px]" src={icon} alt="Logo" />

      <div>
        <p className="text-4xl text-center font-semibold">
          Tell us about your work
        </p>
        <p className="pt-4 text-center font-medium opacity-50">
          Let's customize your experience.
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
        <SelectField
          label="What type of work do you do"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          options={WORK_TYPES}
        />
        <SelectField
          label="What is the size of your sales and product team"
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          options={TEAM_SIZES}
        />
        <SelectField
          label="What is your role in the company"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLES}
        />

        <button
          type="submit"
          className="text-center mt-6 text-[#3CC473] font-semibold p-5 bg-[#E7FCEF] rounded-lg w-full"
        >
          Almost Ready
        </button>
      </form>
    </AuthLayout>
  );
}
