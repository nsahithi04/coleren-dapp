import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/userSlice";
import { persistor } from "@/store/store";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (!rememberMe) {
      persistor.purge();
      localStorage.removeItem("rememberMe");
    }
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#CFCFCF] px-8 py-4 flex items-center justify-between">
        <p className="font-semibold text-[#062732] text-lg">Coleren</p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-[#555555]">{user.email}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-[#E94055] underline"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="p-8 max-w-4xl mx-auto grid gap-6">
        {/* Welcome */}
        <div>
          <p className="text-3xl font-semibold text-[#062732]">
            Welcome back, {user.name} 👋
          </p>
          <p className="text-[#555555] mt-1">
            Here's a summary of your account.
          </p>
        </div>

        {/* User details card */}
        <div className="bg-white border border-[#CFCFCF] rounded-xl p-6 grid gap-4">
          <p className="font-semibold text-[#062732] text-lg">Your Profile</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#A1A1A1] font-medium">Full Name</p>
              <p className="text-[#062732] font-semibold">{user.name || "—"}</p>
            </div>
            <div>
              <p className="text-[#A1A1A1] font-medium">Email</p>
              <p className="text-[#062732] font-semibold">
                {user.email || "—"}
              </p>
            </div>
            <div>
              <p className="text-[#A1A1A1] font-medium">Role</p>
              <p className="text-[#062732] font-semibold">{user.role || "—"}</p>
            </div>
            <div>
              <p className="text-[#A1A1A1] font-medium">Work Type</p>
              <p className="text-[#062732] font-semibold">
                {user.workType || "—"}
              </p>
            </div>
            <div>
              <p className="text-[#A1A1A1] font-medium">Team Size</p>
              <p className="text-[#062732] font-semibold">
                {user.teamSize || "—"}
              </p>
            </div>
            <div>
              <p className="text-[#A1A1A1] font-medium">Newsletter</p>
              <p className="text-[#062732] font-semibold">
                {user.subscribed ? "Subscribed ✅" : "Not subscribed"}
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder content */}
        <div className="bg-white border border-[#CFCFCF] rounded-xl p-6">
          <p className="font-semibold text-[#062732] text-lg mb-2">Dashboard</p>
          <p className="text-[#A1A1A1] text-sm">
            Your analytics and insights will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
