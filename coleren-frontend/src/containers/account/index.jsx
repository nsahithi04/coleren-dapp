import DashboardLayout from "@/layouts/dashboard/index";
import Profile from "@/containers/account/profile";
import Settings from "@/containers/account/settings";
import Teams from "@/containers/account/teams";
import Invite from "@/containers/account/invite";

import { useParams, useNavigate } from "react-router-dom";

export default function Account() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || "profile";

  const TABS = [
    { label: "Profile", key: "profile" },
    { label: "Teams", key: "teams" },
    { label: "Settings", key: "settings" },
    { label: "Invite", key: "invite" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "teams":
        return <Teams />;
      case "invite":
        return <Invite />;
      default:
        return <Profile />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10 h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-[#062732] mb-6">
          My Account
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-[#E7FCEF] w-fit p-1 rounded-md flex-shrink-0">
          {TABS.map((tabItem) => {
            let base = "px-4 py-2 rounded-md text-sm font-medium transition";
            let style = "text-[#062732]";

            if (activeTab === tabItem.key) {
              style = "bg-white shadow-sm text-[#062732] font-semibold";
            }

            return (
              <button
                key={tabItem.key}
                onClick={() => navigate(`/account/${tabItem.key}`)}
                className={`${base} ${style}`}
              >
                {tabItem.label}
              </button>
            );
          })}
        </div>

        {/* Content — fills remaining height, scrolls internally */}
        <div className="bg-white shadow-md rounded-xl p-10 flex-1 overflow-y-auto min-h-0">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
