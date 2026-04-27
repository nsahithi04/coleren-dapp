import { useState } from "react";
import InviteDrop from "@/components/common/inviteDropdown";

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

const emptyRow = () => ({
  email: "",
  role: "",
  access: "",
});

export default function Invite() {
  const [rows, setRows] = useState([emptyRow()]);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const handleCancel = () => {
    setRows((prev) => {
      const filtered = prev.filter(
        (row) => row.email || row.role || row.access,
      );

      return filtered.length ? filtered : [emptyRow()];
    });
  };

  const handleSend = () => {
    console.log(rows);
  };

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
                <div>
                  <label className="text-xs mb-1 block">Email</label>
                  <input
                    type="email"
                    placeholder="sample@company.com"
                    value={row.email}
                    onChange={(e) => updateRow(i, "email", e.target.value)}
                    className="w-full border border-[#A1A1A1] rounded-lg px-3 py-3.5 text-sm text-[#062732] placeholder:text-[#A1A1A1]"
                  />
                </div>

                <InviteDrop
                  label="Role"
                  value={row.role}
                  onChange={(e) => updateRow(i, "role", e.target.value)}
                  options={ROLES}
                />

                <InviteDrop
                  label="Access"
                  value={row.access}
                  onChange={(e) => updateRow(i, "access", e.target.value)}
                  options={ACCESS}
                />
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="mt-4 bg-[#E7FCEF] flex items-center gap-2 text-md font-semibold text-[#24BC61] rounded-lg p-3"
          >
            + Add new
          </button>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSend}
            className="bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold"
          >
            Send invites
          </button>

          <button
            onClick={handleCancel}
            className="border border-[#00000080] text-gray-600 py-3 px-5 rounded-lg font-semibold text-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
