import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import Table from "../../components/common/table";

import { feedback } from "../../services/feedbackService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

import { TYPE_STYLE, PHASE_STYLE, OUTCOME_STYLE } from "../../utils/styles";
import Button from "../../components/dashboard/button";

const columns = [
  { header: "Client", accessorKey: "client", size: 200 },
  { header: "Feedback", accessorKey: "type", size: 230 },
  { header: "Phase", accessorKey: "phase", size: 180 },
  { header: "Outcome", accessorKey: "outcome", size: 100 },
  { header: "Date", accessorKey: "createdAt", size: 180 },
  { header: "Sales Rep", accessorKey: "salesRep", size: 150 },
];

export default function Feedback() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);
  const [token, setToken] = useState(null);

  const TYPE_MAP = {
    interview: "SALES REP",
    call: "CALL SUMMARY",
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const t = await user.getIdToken();
      setToken(t);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!token) return;

    const type = activeTab === "all" ? "ALL" : TYPE_MAP[activeTab];

    const fetchData = async () => {
      const res = await feedback(token, type);
      console.log("FEEDBACK DATA:", res);
      setData(res || []);
    };

    fetchData();
  }, [activeTab, token]);

  const phaseStyle = selectedRow ? PHASE_STYLE[selectedRow.phase] : null;
  const outcomeStyle = selectedRow ? OUTCOME_STYLE[selectedRow.outcome] : null;

  const activeClass =
    "bg-white text-[#114354] font-semibold rounded-lg shadow-md";

  return (
    <DashboardLayout>
      <div className="grid grid-cols-[3fr_1fr] h-full">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-[#062732] mb-6">
            Feedback
          </h1>

          <div className="flex gap-4 mb-5 p-1.5 bg-[#E7FCEF] rounded-lg w-fit shadow-md">
            <div
              className={`p-2 ${activeTab === "all" ? activeClass : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Feedback
            </div>

            <div
              className={`p-2 ${activeTab === "interview" ? activeClass : ""}`}
              onClick={() => setActiveTab("interview")}
            >
              Sales Rep Interview
            </div>

            <div
              className={`p-2 ${activeTab === "call" ? activeClass : ""}`}
              onClick={() => setActiveTab("call")}
            >
              Sales Call Summary
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-5">
            <Table
              data={data}
              columns={columns}
              selectedRow={selectedRow}
              onRowSelect={setSelectedRow}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5">
          {selectedRow ? (
            <div className="flex flex-col gap-5">
              <div className="bg-[#E7FCEF] p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Feedback report</p>

                <h2 className="text-xl font-semibold text-[#062732] leading-snug">
                  {selectedRow.type === "SALES REP"
                    ? "Representative Interview"
                    : "Call Summary"}{" "}
                  for{" "}
                  <span className="text-green-600">{selectedRow.client}</span>
                </h2>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="font-medium text-[#062732]">
                    {new Date(selectedRow.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="font-medium text-[#062732]">
                    {selectedRow.client}
                  </span>
                </div>

                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Sales Rep</span>
                  <span className="font-medium text-[#062732]">
                    {selectedRow.salesRep}
                  </span>
                </div>

                <div className="flex-1 border-t border-[#EFEFEF]" />

                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Outcome</span>
                  <span className="font-medium text-[#062732]">
                    <Button
                      label={selectedRow.outcome}
                      color={outcomeStyle.bg}
                      text={outcomeStyle.text}
                    />
                  </span>
                </div>

                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Phase</span>
                  <span className="font-medium text-[#062732]">
                    <Button
                      label={selectedRow.phase}
                      color={phaseStyle.bg}
                      text={phaseStyle.text}
                    />
                  </span>
                </div>
              </div>

              {selectedRow.positives?.length > 0 && (
                <div className="rounded-lg border border-green-100 bg-[#E7FCEF]">
                  <div className="px-4 pt-3">
                    <span className="text-sm font-bold tracking-widest text-[#15BA92]">
                      POSITIVES
                    </span>
                  </div>

                  <ul className="px-4 py-3 space-y-2">
                    {selectedRow.positives.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-[#15BA92]"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRow.negatives?.length > 0 && (
                <div
                  className="rounded-lg bg-[#FFF8F9]
                "
                >
                  <div className="px-4 pt-3">
                    <span className="text-sm font-bold tracking-widest text-[#D64750]">
                      NEGATIVES
                    </span>
                  </div>

                  <ul className="px-4 py-3 space-y-2">
                    {selectedRow.negatives.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-[#D64750]"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">Select a selectedRow</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
