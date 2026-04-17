import DashboardLayout from "@/layouts/dashboard/index";
import Overview from "@/containers/sequences/overview/index";
import Rules from "@/containers/sequences/rules/index";
import Frequency from "@/containers/sequences/frequency/index";

import { useSelector, useDispatch } from "react-redux";
import { setActiveType } from "@/store/sequenceSlice";

import CallIcon from "@/components/sequences/icons/call";
import SalesIcon from "@/components/sequences/icons/sales";

import { useParams, useNavigate } from "react-router-dom";

export default function Sequences() {
  const dispatch = useDispatch();
  const activeType = useSelector((state) => state.sequence.activeType);

  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tab || "overview";

  const TYPE_TABS = [
    {
      label: "Sales Rep Interviews",
      key: "salesRep",
      modified: "Modified: 3 days ago",
    },
    {
      label: "Call Summaries",
      key: "callSummary",
      modified: "Modified: 1 week ago",
    },
  ];

  const TABS = [
    { label: "overview", key: "overview" },
    { label: "rules", key: "rules" },
    { label: "frequency", key: "frequency" },
  ];

  let content = <Overview />;
  if (activeTab === "rules") content = <Rules />;
  if (activeTab === "frequency") content = <Frequency />;

  const typeButtons = [];

  for (let i = 0; i < TYPE_TABS.length; i++) {
    const item = TYPE_TABS[i];
    const isActive = activeType === item.key;

    let buttonClass =
      "flex items-center gap-4 pl-5 pr-10 py-5 rounded-xl border transition-all text-left border-gray-100 bg-white";

    let iconWrapperClass =
      "w-11 h-11 rounded-xl flex items-center justify-center bg-white";

    if (isActive) {
      buttonClass =
        "flex items-center gap-4 pl-5 pr-10 py-5 rounded-xl border transition-all text-left border-[#25C766] bg-gradient-to-r from-white to-[#CBF6DC]";

      iconWrapperClass =
        "w-11 h-11 rounded-xl flex items-center justify-center bg-[#E7FCEF]";
    }

    let icon;

    if (item.key === "salesRep") {
      icon = <SalesIcon size="26" />;
    } else {
      icon = <CallIcon size="26" />;
    }

    typeButtons.push(
      <button
        key={item.key}
        onClick={() => dispatch(setActiveType(item.key))}
        className={buttonClass}
      >
        <div className={iconWrapperClass}>{icon}</div>

        <div>
          <p className="text-md font-semibold text-[#062732]">{item.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{item.modified}</p>
        </div>
      </button>,
    );
  }

  const tabButtons = [];

  for (let i = 0; i < TABS.length; i++) {
    const tabItem = TABS[i];

    let tabClass =
      "px-4 py-2 rounded-md text-sm font-medium transition text-[#062732]";

    if (activeTab === tabItem.key) {
      tabClass =
        "px-4 py-2 rounded-md text-sm font-medium transition bg-white shadow-sm font-semibold";
    }

    tabButtons.push(
      <button
        key={tabItem.key}
        onClick={() => navigate(`/sequences/${tabItem.key}`)}
        className={tabClass}
      >
        {tabItem.label}
      </button>,
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 h-full flex flex-col">
        <h1 className="text-2xl font-semibold text-[#062732] mb-6">
          Sequences
        </h1>

        {/* TYPE TOGGLE */}
        <div className="grid grid-cols-2 gap-4 mb-6 w-fit">{typeButtons}</div>

        {/* CONTENT */}
        <div className="bg-white shadow-md rounded-xl p-10 flex-1 overflow-y-auto min-h-0">
          <div className="flex gap-2 mb-6 bg-[#E7FCEF] w-fit p-1 rounded-md">
            {tabButtons}
          </div>

          {content}
        </div>
      </div>
    </DashboardLayout>
  );
}
