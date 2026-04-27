import { useNavigate, useParams } from "react-router-dom";
import Overview from "../overview";
import Frequency from "../frequency";
import Rules from "../rules";
import DashboardLayout from "../../layout/dashboardLayout";

import SalesIcon from "@/components/common/icons/sales";
import CallIcon from "@/components/common/icons/call";

export default function Sequences() {
  const navigate = useNavigate();
  const { type, tab } = useParams();

  const activeType = type || "salesRep";
  const activeTab = tab || "overview";

  let content = <Overview />;
  if (activeTab === "rules") content = <Rules />;
  if (activeTab === "frequency") content = <Frequency />;

  const getTypeClass = (key) => {
    if (activeType === key) {
      return "flex items-center gap-4 pl-5 pr-10 py-5 rounded-xl border transition-all text-left border-[#25C766] bg-gradient-to-r from-white to-[#CBF6DC]";
    }
    return "flex items-center gap-4 pl-5 pr-10 py-5 rounded-xl border transition-all text-left border-gray-100 bg-white";
  };

  const getTabClass = (key) => {
    if (activeTab === key) {
      return "px-4 py-2 bg-white rounded-md shadow text-sm font-semibold";
    }
    return "px-4 py-2 text-sm";
  };

  return (
    <DashboardLayout>
      <div className="p-10 flex flex-col h-full">
        <h1 className="text-2xl font-semibold mb-6">Sequences</h1>

        {/* TYPE */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate(`/sequences/salesRep/${activeTab}`)}
            className={getTypeClass("salesRep")}
          >
            <SalesIcon />
            <div>
              <p>Sales Rep Interviews</p>
              <p className="text-xs text-gray-400">Modified: 3 days ago</p>
            </div>
          </button>

          <button
            onClick={() => navigate(`/sequences/callSummary/${activeTab}`)}
            className={getTypeClass("callSummary")}
          >
            <CallIcon />
            <div>
              <p>Call Summaries</p>
              <p className="text-xs text-gray-400">Modified: 1 week ago</p>
            </div>
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-white p-10 rounded-xl flex-1">
          {/* TABS */}
          <div className="flex gap-2 mb-6 bg-[#E7FCEF] p-1 rounded-md w-fit">
            <button
              onClick={() => navigate(`/sequences/${activeType}/overview`)}
              className={getTabClass("overview")}
            >
              Overview
            </button>

            <button
              onClick={() => navigate(`/sequences/${activeType}/rules`)}
              className={getTabClass("rules")}
            >
              Rules
            </button>

            <button
              onClick={() => navigate(`/sequences/${activeType}/frequency`)}
              className={getTabClass("frequency")}
            >
              Frequency
            </button>
          </div>
          <div className="p-7 border border-gray-200 rounded-xl">{content}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
