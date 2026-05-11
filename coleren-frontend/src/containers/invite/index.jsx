import { useEffect, useState } from "react";
import InviteDrop from "@/components/common/inviteDropdown";
import { inviteMembers } from "@/services/teamService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

const ROLES = ["Product", "Sales"];

const ACCESS = ["Viewer", "Admin"];

const emptyRow = () => ({
  email: "",
  role: "",
  access: "",
});

export default function Invite() {
  const [token, setToken] = useState(null);
  const [rows, setRows] = useState([emptyRow()]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      const t = await firebaseUser.getIdToken();
      setToken(t);
    });

    return () => unsubscribe();
  }, []);

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

  const handleSend = async () => {
    try {
      await inviteMembers(rows, token);

      setSuccessOpen(true);

      setRows([emptyRow()]);
    } catch (err) {
      setErrorMessage(err.message);
    }
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

      {successOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-[#062732] mb-2">
              Invites Sent
            </h2>

            <p className="text-gray-500 mb-6">
              Team members were added successfully.
            </p>

            <button
              onClick={() => setSuccessOpen(false)}
              className="bg-[#25C766] text-white px-6 py-3 rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-red-500 mb-2 ">
              Access Denied
            </h2>

            <p className="text-gray-500 mb-6">{errorMessage}</p>

            <button
              onClick={() => setErrorMessage("")}
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
