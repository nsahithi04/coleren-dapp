import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "@/store/userSlice";
import { persistor } from "@/store/store";
import icon from "@/assets/icons/icon-white.svg";

import { GettingStartedIcon } from "@/components/dashboard/icons/GettingStartedIcon";
import { DashboardIcon } from "@/components/dashboard/icons/DashboardIcon";
import { FeedbackIcon } from "@/components/dashboard/icons/FeedbackIcon";
import { ConnectorsIcon } from "@/components/dashboard/icons/ConnectorsIcon";
import { SequencesIcon } from "@/components/dashboard/icons/SequencesIcon";
import { SurveysIcon } from "@/components/dashboard/icons/SurveysIcon";

import { TeamsIcon } from "@/components/dashboard/icons/TeamsIcon";
import { ProfileIcon } from "@/components/dashboard/icons/ProfileIcon";
import { SettingsIcon } from "@/components/dashboard/icons/SettingsIcon";
import { InviteIcon } from "@/components/dashboard/icons/InviteIcon";

import { SignOutIcon } from "@/components/dashboard/icons/SignOutIcon";

const navItems = [
  {
    Icon: GettingStartedIcon,
    label: "Getting Started",
    path: "/GettingStarted",
  },
  { Icon: DashboardIcon, label: "Dashboard", path: "/Dashboard" },
  { Icon: FeedbackIcon, label: "Feedback", path: "/feedback" },
  { Icon: ConnectorsIcon, label: "Connectors", path: "/connectors" },
  { Icon: SequencesIcon, label: "Sequences", path: "/sequences" },
  { Icon: SurveysIcon, label: "Surveys", path: "/surveys" },
];

const accountItems = [
  { Icon: ProfileIcon, label: "Profile", path: "/account/profile" },
  { Icon: TeamsIcon, label: "Teams", path: "/account/teams" },
  { Icon: SettingsIcon, label: "Settings", path: "/account/settings" },
  { Icon: InviteIcon, label: "Invite People", path: "/account/invite" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    persistor.purge();
    localStorage.removeItem("rememberMe");
    sessionStorage.clear();
    dispatch(logoutUser());
    navigate("/login");
  };

  const NavButton = ({ Icon, label, path }) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-lg transition-colors ${
          active
            ? "bg-[#114354] text-white font-semibold"
            : "text-white/60 hover:text-white"
        }`}
      >
        <span className="flex-shrink-0">
          <Icon active={active} />
        </span>
        {label}
      </button>
    );
  };

  return (
    <aside className="w-[220px] min-h-screen bg-[#062732] flex flex-col px-4 py-6 fixed left-0 top-0">
      {/* Logo */}
      <div className="mb-10 px-2">
        <img src={icon} alt="Logo" className="w-28" />
      </div>

      {/* Main nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavButton key={item.path} {...item} />
        ))}
      </nav>

      <div className="my-6 border-t border-white/20" />

      {/* Account section */}
      <div className="flex flex-col gap-1">
        <p className="text-[#6BFF64] text-xs font-semibold tracking-widest uppercase px-3 mb-1">
          My Account
        </p>
        {accountItems.map((item) => (
          <NavButton key={item.path} {...item} />
        ))}
      </div>

      <div className="my-6 border-t border-white/20" />

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-left text-sm px-3 py-2.5 rounded-lg text-white/70 hover:text-[#E94055] transition-colors"
      >
        <span className="flex-shrink-0">
          <SignOutIcon />
        </span>
        Sign Out
      </button>
    </aside>
  );
}
