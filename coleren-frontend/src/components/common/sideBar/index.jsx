import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logoutUser } from "@/store/userSlice";

import icon from "../icons/icon-white.svg";
import { ConnectorsIcon } from "../icons/ConnectorsIcon";
import { DashboardIcon } from "../icons/DashboardIcon";
import { GettingStartedIcon } from "../icons/GettingStartedIcon";
import { FeedbackIcon } from "../icons/FeedbackIcon";
import { SequencesIcon } from "../icons/SequencesIcon";
import { SurveysIcon } from "../icons/SurveysIcon";
import { TeamsIcon } from "../icons/TeamsIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SettingsIcon } from "../icons/SettingsIcon";
import { InviteIcon } from "../icons/InviteIcon";
import { SignOutIcon } from "../icons/SignOutIcon";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const navItems = [
    {
      label: "Getting Started",
      icon: GettingStartedIcon,
      path: "/gettingStarted",
    },
    { label: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    { label: "Feedback", icon: FeedbackIcon, path: "/feedback" },
    { label: "Connectors", icon: ConnectorsIcon, path: "/connectors" },
    { label: "Sequences", icon: SequencesIcon, path: "/sequences" },
    { label: "Surveys", icon: SurveysIcon, path: "/surveys" },
  ];

  const accountItems = [
    { label: "Profile", icon: ProfileIcon, path: "/account/profile" },
    { label: "Teams", icon: TeamsIcon, path: "/account/teams" },
    { label: "Settings", icon: SettingsIcon, path: "/account/settings" },
    { label: "Invite", icon: InviteIcon, path: "/account/invite" },
  ];

  const renderItem = (item) => {
    const Icon = item.icon;

    let className =
      "group flex items-center gap-4 p-2 rounded-lg cursor-pointer transition text-white/70";

    let iconClass = "transition";

    if (location.pathname === item.path) {
      className =
        "group flex items-center gap-4 p-2 font-semibold rounded-lg cursor-pointer transition bg-[#114354] text-white";

      iconClass = "text-[#6BFF64]";
    } else {
      className =
        "group flex items-center gap-4 p-2 rounded-lg cursor-pointer transition text-white/70 hover:text-white hover:bg-[#114354] hover:font-semibold";

      iconClass = "text-white/70 group-hover:text-[#6BFF64]";
    }

    return (
      <li
        key={item.label}
        onClick={() => navigate(item.path)}
        className={className}
      >
        <Icon className={iconClass} />
        {item.label}
      </li>
    );
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
  };

  return (
    <aside className="w-[220px] h-screen bg-[#062732] flex flex-col px-4 py-10 fixed left-0 top-0">
      {/* Logo */}
      <div className="mb-6 px-2">
        <img src={icon} alt="Logo" className="w-28" />
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 mb-4" />

      {/* Top Menu */}
      <ul className="flex flex-col gap-1">{navItems.map(renderItem)}</ul>

      {/* Spacer */}

      {/* Divider */}
      <div className="border-t border-white/20 my-4" />

      {/* Bottom Menu */}
      <ul className="flex flex-col gap-1 mb-4">
        {accountItems.map(renderItem)}
      </ul>
      <div className="flex-1"></div>
      <div className="border-t border-white/20 my-4" />

      {/* Sign Out */}
      <div
        onClick={handleLogout}
        className="group  flex items-center gap-4 p-2 rounded-lg cursor-pointer text-white/70 hover:text-white hover:bg-[#114354] hover:font-semibold"
      >
        <SignOutIcon className="group-hover:text-[#6BFF64] " />
        Sign Out
      </div>
    </aside>
  );
}
