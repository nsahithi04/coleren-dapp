import { useSelector } from "react-redux";
import EditIcon from "@/components/account/icons/edit";
import UserIcon from "@/components/account/icons/user";
import Email from "@/components/account/icons/email";
import Role from "@/components/account/icons/role";
import Department from "@/components/account/icons/department";

export default function Profile() {
  const userData = useSelector((state) => state.user);

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-[#062732]">Account info</h1>

          <button className="flex items-center gap-2 px-3 py-2 border border-[1.5px] rounded-md text-sm font-semibold text-[#24BC61] hover:bg-[#E7FCEF] transition">
            <EditIcon color="#24BC61" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 grid-cols-[auto_160px_1fr] items-center">
            <UserIcon />

            <label className="text-sm text-gray-500">Name</label>
            <div>{userData?.name || "-"}</div>
          </div>

          <div className="grid gap-3 grid-cols-[auto_160px_1fr] items-center">
            <Email />
            <label className="text-sm text-gray-500">Email</label>
            <div>{userData?.email || "-"}</div>
          </div>

          <div className="grid gap-3 grid-cols-[auto_160px_1fr] items-center">
            <Role />
            <label className="text-sm text-gray-500">Role</label>
            <div>{userData?.role || "-"}</div>
          </div>

          <div className="grid gap-3 grid-cols-[auto_160px_1fr] items-center">
            <Department />
            <label className="text-sm text-gray-500">Work Type</label>
            <div>{userData?.workType || "-"}</div>
          </div>
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
        <button className="h-fit flex items-center gap-2 px-3 py-2 border border-[1.5px] rounded-md text-sm font-semibold text-[#24BC61] hover:bg-[#E7FCEF] transition">
          <EditIcon color="#24BC61" />
          Change
        </button>
      </div>
    </div>
  );
}
