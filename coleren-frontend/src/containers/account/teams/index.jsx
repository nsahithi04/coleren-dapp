import { useSelector } from "react-redux";
import EditIcon from "@/components/account/icons/edit";
import SortIcon from "@/components/feedback/icons/SortIcon";
import TrashIcon from "@/components/account/icons/trash";

const mockTeam = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    access: "Full Access",
  },
  {
    id: 2,
    name: "Anna Harris",
    email: "anna@example.com",
    role: "Member",
    access: "Limited",
  },
];

const COLS = ["User", "Email", "Role", "Access", "Edit", ""];

export default function Teams() {
  const currentUser = useSelector((state) => state.user);

  const teamData = [
    {
      id: "owner",
      name: currentUser?.name || "You",
      email: currentUser?.email || "-",
      role: "Owner",
      access: "Full Access",
      isOwner: true,
    },
    ...mockTeam,
  ];

  return (
    <div>
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {COLS.map((col, i) => (
                <th
                  key={i}
                  className={`pt-3 pb-5 px-4 text-left text-md font-semibold ${
                    i === COLS.length - 1 ? "w-[1%] whitespace-nowrap" : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {col}
                    {col && <SortIcon />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {/* Body */}
          <tbody>
            {teamData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* Name */}
                <td className="py-3 px-4 font-medium text-[#062732]">
                  {user.name}
                </td>

                {/* Email */}
                <td className="py-3 px-4 text-[#24BC61] underline">
                  {user.email}
                </td>

                {/* Role */}
                <td className="py-3 px-4">
                  <span className={` text-md rounded ${user.isOwner}`}>
                    {user.role}
                  </span>
                </td>

                {/* Access */}
                <td className="py-3 px-4">{user.access}</td>

                {/* Edit */}
                <td className="py-3 px-4 w-[1%] whitespace-nowrap">
                  {!user.isOwner && (
                    <button className="text-[#24BC61] hover:opacity-70">
                      <EditIcon color="#24BC61" />
                    </button>
                  )}
                </td>

                <td className="py-3 px-4 w-[1%] whitespace-nowrap">
                  {!user.isOwner && (
                    <button className="text-red-500 hover:opacity-70">
                      <TrashIcon color="#000000" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
