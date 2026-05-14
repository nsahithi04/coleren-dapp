import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import DashboardLayout from "../../layout/dashboardLayout";
import SalesIcon from "@/components/common/icons/sales";
import CallIcon from "@/components/common/icons/call";

export default function Survey() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tab, setTab] = useState("email");

  let activeTab =
    "flex items-center gap-4 pl-5 pr-10 py-7 rounded-xl border transition-all text-left border-[#25C766] shadow-[0px_8px_30px_0px_#0000000D]";
  let activeSurvey, activeEmail;
  if (tab == "email") {
    activeEmail = activeTab;
    activeSurvey =
      "flex items-center gap-4 pl-5 pr-10 py-7 rounded-xl shadow-md transition-all text-left border-gray-100 border bg-white";
  } else {
    activeSurvey = activeTab;
    activeEmail =
      "flex items-center gap-4 pl-5 pr-10 py-7 rounded-xl shadow-md transition-all text-left border-gray-100 border bg-white";
  }

  return (
    <DashboardLayout>
      <div className="p-10 flex flex-col min-h-screen gap-5 ">
        <h1 className="text-2xl font-semibold mb-1">Sequences</h1>

        {/* TYPE */}
        <div className="grid grid-cols-2 gap-10 w-full h-fit">
          <button
            onClick={() => {
              setTab("email");
            }}
            className={activeEmail}
          >
            <div className="bg-[#E7FCEF] p-2 rounded-sm">
              <SalesIcon />
            </div>

            <div>
              <p> Send Invite mail</p>
              <p className="text-xs text-gray-400">Customize your messages</p>
            </div>
          </button>

          <button
            onClick={() => {
              setTab("survey");
            }}
            className={activeSurvey}
          >
            <div className="bg-[#E7FCEF] p-2 rounded-sm">
              {" "}
              <CallIcon />
            </div>

            <div>
              <p>Send Survey</p>
              <p className="text-xs text-gray-400">
                Set reminders for your team
              </p>
            </div>
          </button>
        </div>
        <div className="bg-white p-10 rounded-xl flex-1">
          {tab == "email" ? (
            <div className="flex items-center gap-4  px-10 py-7 rounded-xl shadow-md transition-all text-left border-gray-100 border bg-white">
              <div>
                <p> Email Templete</p>
                <p className="text-xs text-gray-400">Customize your messages</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 px-10 py-7 rounded-xl shadow-md transition-all text-left border-gray-100 border bg-white">
              <div>
                <p> Survey Templete</p>
                <p className="text-xs text-gray-400">
                  Questions for new leads to introduce
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
