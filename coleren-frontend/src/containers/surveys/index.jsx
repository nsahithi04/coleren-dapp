import DashboardLayout from "@/layouts/dashboard/index";
import { useState } from "react";
import InviteMail from "../../components/surveys/icons/inviteMail";
import ReminderMail from "../../components/surveys/icons/reminderMail";

export default function Surveys() {
  const [activeType, setActiveType] = useState("Invite");

  const TYPE_TABS = [
    {
      label: "Send Invite mail",
      key: "Invite",
      desc: "Customize your messages",
    },
    {
      label: "Send Reminders",
      key: "Reminders",
      desc: "Set reminders for your team",
    },
  ];

  const typeButtons = [];

  for (let i = 0; i < TYPE_TABS.length; i++) {
    const item = TYPE_TABS[i];
    const isActive = activeType === item.key;

    let buttonClass =
      "flex items-center justify-between gap-4 px-6 py-6 rounded-2xl border border-[#A1A1A180] bg-white transition";

    if (isActive) {
      buttonClass =
        "flex items-center justify-between gap-4 px-6 py-6 rounded-2xl border-2 border-[#25C766] shadow-[0_0_0_4px_#E7FCEF] ";
    }

    let icon;

    if (item.key === "Invite") {
      icon = <InviteMail />;
    } else {
      icon = <ReminderMail />;
    }

    typeButtons.push(
      <button
        key={item.key}
        onClick={() => setActiveType(item.key)}
        className={buttonClass}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E7FCEF] flex items-center justify-center">
            {icon}
          </div>

          <div className="text-left">
            <p className="font-semibold text-[#062732]">{item.label}</p>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#25C766] flex items-center justify-center text-white">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.5 15L13.5 10L8.5 5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>,
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 grid gap-8">
        <h1 className="text-2xl font-semibold text-[#062732]">Surveys</h1>

        <div className="grid grid-cols-2 w-fit gap-6">{typeButtons}</div>

        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-[#062732]">
            Survey templates
          </h2>
        </div>
      </div>
    </DashboardLayout>
  );
}
