import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/dashboard/index";
import FeedbackRow from "@/components/feedback/feedbackRow/index";
import FeedbackDetailPanel from "@/components/feedback/feedbackDetail/index";
import SortIcon from "@/components/feedback/icons/SortIcon";

const MOCK_DATA = [
  {
    id: 1,
    client: "Enterprise Business",
    type: "SALES REP",
    phase: "IN PROGRESS",
    outcome: "WIN",
    date: "25-Jan-2025",
    salesRep: "John Smith",
    positives: [
      "They really liked our mobile experience",
      "The UX and design seemed to impress them",
      "Pricing was competitive compared to alternatives",
    ],
    negatives: [
      "Our lack of APIs and integrations stood out against competitors in our space",
      "The platform configurations were not well understood",
    ],
  },
  {
    id: 2,
    client: "Company XYZ",
    type: "CALL SUMMARY",
    phase: "NEW",
    outcome: "TBD",
    date: "25-Jan-2025",
    salesRep: "Anna Harris",
    positives: [
      "Strong interest in the analytics dashboard",
      "Team was engaged throughout the demo",
    ],
    negatives: [
      "Requested deeper CRM integrations we don't currently support",
      "Timeline expectations were unclear from their side",
    ],
  },
];

const TABS = ["All Feedback", "Sales Rep Interview", "Sales Call Summary"];
const COLS = ["Client", "Feedback", "Phase", "Outcome", "Date", "Sales Rep"];

export default function Feedback() {
  const [activeTab, setActiveTab] = useState("All Feedback");
  const [activeRow, setActiveRow] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(MOCK_DATA);
    setLoading(false);
  }, []);

  const filtered = data.filter((row) => {
    if (activeTab === "Sales Rep Interview") return row.type === "SALES REP";
    if (activeTab === "Sales Call Summary") return row.type === "CALL SUMMARY";
    return true;
  });

  // Always default to first visible row in current tab
  const resolvedActiveRow = activeRow ?? filtered[0]?.id ?? null;
  const selectedRow = filtered.find((r) => r.id === resolvedActiveRow) ?? null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveRow(null); // reset so fallback picks first row of new tab
  };

  return (
    <DashboardLayout>
      <div className="grid gap-5 grid-cols-[3fr_1fr] h-full">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-[#062732] mb-6">
            Feedback
          </h1>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 mb-5 p-1.5 rounded-xl w-fit shadow-md"
            style={{ background: "#E7FCEF" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className="px-5 py-2 text-md font-semibold rounded-lg transition-all duration-150"
                style={
                  activeTab === tab
                    ? {
                        background: "#ffffff",
                        color: "#062732",
                        boxShadow: "0 1px 4px 0 rgba(6,39,50,0.10)",
                      }
                    : {
                        background: "transparent",
                        color: "#062732",
                        fontWeight: "500",
                      }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-5 w-full">
              {loading ? (
                <div className="py-16 text-center text-gray-400 text-md">
                  Loading feedback…
                </div>
              ) : (
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {COLS.map((col) => (
                        <th
                          key={col}
                          className="pt-3 pb-5 px-4 text-left text-sm font-semibold tracking-wider"
                        >
                          <span className="flex items-center gap-1.5">
                            {col}
                            <SortIcon />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <FeedbackRow
                        key={row.id}
                        row={row}
                        isActive={resolvedActiveRow === row.id}
                        onClick={() => setActiveRow(row.id)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <FeedbackDetailPanel row={selectedRow} />
      </div>
    </DashboardLayout>
  );
}
