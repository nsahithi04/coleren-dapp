import { useEffect, useState } from "react";
import { getTeam } from "@/services/teamService";
import EditIcon from "@/components/common/icons/edit";
import TrashIcon from "@/components/common/icons/trash";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

const COLS = ["User", "Email", "Role", "Access", "Edit", ""];

export default function Teams() {
  const [teamData, setTeamData] = useState([]);
  const [token, setToken] = useState(null);

  const currentUser = useSelector((state) => state.user);

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
              teamData.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#062732]">
                    {user.name}
                    {user.isOwner && (
                      <span className="ml-2 text-xs text-gray-400">
                        (Owner)
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#24BC61] underline">
                    {user.email}
                  </td>

                  <td className="py-3 px-4">{user.role}</td>

                  <td className="py-3 px-4">{user.access}</td>

                  <td className="py-3 px-4">
                    {!user.isOwner && user.access === "ADMIN" && (
                      <button className="text-[#24BC61]">
                        <EditIcon />
                      </button>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {!user.isOwner && user.access === "ADMIN" && (
                      <button className="text-red-500">
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
      </div>
    </div>
  );
}
