import icon from "@/assets/icons/icon-black.svg";
import hero from "@/assets/images/image-4.png";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/auth/index";
import ErrorBanner from "@/components/auth/ErrorBanner";
import { setUser, setPendingOnboarding } from "@/store/userSlice";
import SelectField from "@/components/auth/SelectField";
import { createUser, createProfile } from "@/services/userService";

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
  const [workType, setWorkType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { uid, name, email, subscribed, fromGoogle } = useSelector(
    (s) => s.user,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!workType || !teamSize || !role) {
      setError("Please fill in all fields before continuing.");
      return;
    }

    try {
      setLoading(true);

      await createUser({
        name,
        email,
        fromGoogle,
      });

      await createProfile({
        role,
        subscribed,
        workType,
        teamSize,
      });

      dispatch(
        setUser({
          uid,
          name,
          email,
          role,
          teamSize,
          workType,
          subscribed,
          fromGoogle,
        }),
      );

      dispatch(setPendingOnboarding(false));

      navigate("/signup/success");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="w-full grid gap-4">
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
