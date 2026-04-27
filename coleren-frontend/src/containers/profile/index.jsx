import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setUser } from "@/store/userSlice";
import EditIcon from "@/components/common/icons/edit";
import Email from "@/components/common/icons/email";
import UserIcon from "@/components/common/icons/user";
import Role from "@/components/common/icons/role";
import Department from "@/components/common/icons/department";
import SelectField from "../../components/auth/selectField";
import { useEffect } from "react";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../services/userService";

const ROLES = [
  "Founder / CEO",
  "Manager",
  "Individual Contributor",
  "Executive",
  "Other",
];

const WORK_TYPES = [
  "Sales",
  "Engineering",
  "Marketing",
  "Design",
  "Operations",
  "Other",
];

export default function Profile() {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(userData.name);
  const [role, setRole] = useState(userData.role);
  const [token, setToken] = useState("");
  const [department, setDepartment] = useState(userData.workType);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const t = await firebaseUser.getIdToken();
        setToken(t);
      } catch (err) {
        console.error(err);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        name,
        role,
        workType: department,
      };

      const updatedUser = await updateProfile(token, payload);

      dispatch(setUser(updatedUser));

      setEdit(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold text-[#062732]">Account info</h1>
        {edit ? (
          <div className="flex gap-2">
            <button
              onClick={() => setEdit(false)}
              className="px-3 py-2 border rounded-md text-sm text-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleSave();
              }}
              className="px-3 py-2 bg-[#24BC61] text-white rounded-md text-sm"
            >
              save
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setEdit(true);
            }}
            className="flex font-semibold items-center gap-2 px-3 py-2 border rounded-md text-sm text-[#24BC61]  hover:bg-[#E7FCEF] transition"
          >
            <EditIcon color="#24BC61" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-[auto_160px_1fr] items-center gap-3">
          <UserIcon />
          <label className="text-sm text-gray-500">Name</label>

          {edit ? (
            <input
              placeholder={name}
              type="text"
              value={name}
              className="w-full p-2 border rounded-lg border-[#A1A1A1]"
              onChange={(e) => {
                if (e.target.value) {
                  setName(e.target.value);
                }
              }}
            />
          ) : (
            <div>{userData?.name || "-"}</div>
          )}
        </div>

        <div className="grid grid-cols-[auto_160px_1fr] items-center gap-3">
          <Email />
          <label className="text-sm text-gray-500">Email</label>

          <div>{userData?.email || "-"}</div>
        </div>

        <div className="grid grid-cols-[auto_160px_1fr] items-center gap-3">
          <Role />
          <label className="text-sm text-gray-500">Role</label>
          {edit ? (
            <SelectField
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={ROLES}
              className="p-2"
            />
          ) : (
            <div>{userData?.role || "-"}</div>
          )}
        </div>
        {/* WORK TYPE */}
        <div className="grid grid-cols-[auto_160px_1fr] items-center gap-3">
          <Department />
          <label className="text-sm text-gray-500">Employment Type</label>
          {edit ? (
            <SelectField
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              options={WORK_TYPES}
              className="p-2"
            />
          ) : (
            <div>{userData?.workType || "-"}</div>
          )}
        </div>
      </div>
      <div className="my-5 border-t border-[#CFCFCF]" />
      <div className="grid grid-cols-[1fr_auto] gap-10">
        <div className="gap-4 grid">
          <div className="font-semibold text-lg">Password change</div>
          <div className="opacity-70">
            A valid password must contain a minimum of 12 characters, and a
            minimum of one lower case letter, one upper case letter, one special
            character and one number.
          </div>
        </div>
        <button
          onClick={() => navigate("/forgot-password")}
          className="h-fit flex items-center gap-2 px-3 py-2 border  rounded-md text-sm font-semibold text-[#24BC61] hover:bg-[#E7FCEF] transition"
        >
          <EditIcon color="#24BC61" />
          Change
        </button>
      </div>
    </div>
  );
}
