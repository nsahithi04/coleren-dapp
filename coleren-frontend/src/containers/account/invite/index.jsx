import { useState } from "react";
import SelectInvite from "@/components/account/invite";

const ROLES = [
  "Product",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Other",
];

const ACCESS = ["Viewer", "Editor", "Admin"];

const emptyRow = () => ({ email: "", role: "product", access: "viewer" });

export default function InvitePeople() {
  const [rows, setRows] = useState([emptyRow()]);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const handleSend = async () => {
    const valid = rows.filter((r) => r.email.trim());
    if (!valid.length) return;

    console.log("Sending invites:", valid);
  };

  const handleCancel = () => setRows([emptyRow()]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold text-[#062732] mb-1">
        Invite your team members
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Get your team together to stay connected and work more efficiently
      </p>
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_180px_180px] gap-3 items-end"
              >
                {/* Email */}
                <div>
                  <label className="text-xs  mb-1 block">Email</label>
                  <input
                    type="email"
                    placeholder="sample@company.com"
                    value={row.email}
                    onChange={(e) => updateRow(i, "email", e.target.value)}
                    className="w-full border border-[#A1A1A1] rounded-lg px-3 py-3.5 text-sm text-[#062732] placeholder:text-[#A1A1A1] "
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs  mb-1 ">Role</label>
                  <SelectInvite
                    value={row.role}
                    onChange={(e) => updateRow(i, "role", e.target.value)}
                    options={ROLES}
                  />
                </div>

                {/* Access */}
                <div>
                  <label className="text-xs mb-1 ">Access</label>
                  <SelectInvite
                    value={row.access}
                    onChange={(e) => updateRow(i, "access", e.target.value)}
                    options={ACCESS}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add new */}
          <button
            onClick={addRow}
            className="mt-4 bg-[#E7FCEF] flex items-center gap-2 text-md font-semibold text-[#24BC61]  rounded-lg p-3  transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H16"
                stroke="#24BC61"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 16V8"
                stroke="#24BC61"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                stroke="#24BC61"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Add new
          </button>
        </div>
        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSend}
            className="bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold hover:bg-[#1fb558] transition-colors"
          >
            Send invites
          </button>
          <button
            onClick={handleCancel}
            className="border border-[#00000080] text-gray-600 py-3 px-5 rounded-lg font-semibold text-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
