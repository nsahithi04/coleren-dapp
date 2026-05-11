import { useEffect, useState } from "react";
import { getTeam } from "@/services/teamService";
import EditIcon from "@/components/common/icons/edit";
import TrashIcon from "@/components/common/icons/trash";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";
import InviteDrop from "@/components/common/inviteDropdown";
import { updateMember } from "@/services/teamService";
import { deleteMember } from "@/services/teamService";

const ROLES = ["Product", "Sales"];

const ACCESS = ["Viewer", "Admin"];

const COLS = ["User", "Email", "Role", "Access", "Edit", ""];

export default function Teams() {
  const [teamData, setTeamData] = useState([]);
  const [token, setToken] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editAccess, setEditAccess] = useState("");

  const currentUserData = teamData.find((u) => u.isCurrentUser);

  const canManageTeam =
    currentUserData?.role === "OWNER" || currentUserData?.access === "ADMIN";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      const t = await firebaseUser.getIdToken();
      setToken(t);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const res = await getTeam(token);
        setTeamData(res || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  const handleUpdate = async () => {
    try {
      await updateMember(
        selectedMember._id,
        {
          role: editRole,
          access: editAccess,
        },
        token,
      );

      setTeamData((prev) =>
        prev.map((member) =>
          member._id === selectedMember._id
            ? {
                ...member,
                role: editRole,
                access: editAccess,
              }
            : member,
        ),
      );

      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(selectedMember._id, token);

      setTeamData((prev) =>
        prev.filter((member) => member._id !== selectedMember._id),
      );

      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const formatText = (text) => text.charAt(0) + text.slice(1).toLowerCase();
  const sortedTeamData = [...teamData].sort((a, b) => {
    if (a.isCurrentUser) return -1;
    if (b.isCurrentUser) return 1;
    return 0;
  });

  return (
    <div>
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {COLS.map((col, i) => (
                <th
                  key={i}
                  className="pt-3 pb-5 px-4 text-left text-md font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamData.length > 0 ? (
              sortedTeamData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#062732]">
                    {user.name}

                    {user.isCurrentUser && (
                      <span className="ml-2 text-xs text-gray-400">(You)</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#24BC61] underline">
                    {user.email}
                  </td>

                  <td className="py-3 px-4">{formatText(user.role)}</td>

                  <td className="py-3 px-4">{formatText(user.access)}</td>

                  <td className="py-3 px-4">
                    {canManageTeam &&
                      !user.isCurrentUser &&
                      user.role !== "OWNER" && (
                        <button
                          onClick={() => {
                            setSelectedMember(user);
                            setEditRole(user.role);
                            setEditAccess(user.access);
                            setEditOpen(true);
                          }}
                        >
                          <EditIcon color="#24BC61" />
                        </button>
                      )}
                  </td>

                  <td className="py-3 px-4">
                    {canManageTeam &&
                      !user.isCurrentUser &&
                      user.role !== "OWNER" && (
                        <button
                          onClick={() => {
                            setSelectedMember(user);
                            setDeleteOpen(true);
                          }}
                        >
                          <TrashIcon />
                        </button>
                      )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No team members found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {editOpen && selectedMember && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[500px] p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#062732]">
                  Edit team
                </h2>

                <p className="opacity-50 text-sm mt-1">
                  Change roles and access for your team members
                </p>
              </div>

              <div className="border-t opacity-10 pt-5 mt-6"></div>
              <p className=" text-lg opacity-100">{selectedMember.name}</p>

              <p className="text-[#24BC61] underline">{selectedMember.email}</p>
              <div className="border-b  opacity-10 pb-5 mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <InviteDrop
                    label="Role"
                    value={editRole}
                    options={ROLES}
                    onChange={(e) => setEditRole(e.target.value)}
                  />
                </div>

                <div>
                  <InviteDrop
                    label="Access"
                    value={editAccess}
                    options={ACCESS}
                    onChange={(e) => setEditAccess(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="border px-6 py-3 rounded-lg opacity-60"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-[#24BC61] text-white px-6 py-3 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {deleteOpen && selectedMember && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteOpen(false)}
                  className="border px-6 py-3 rounded-lg opacity-60"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
