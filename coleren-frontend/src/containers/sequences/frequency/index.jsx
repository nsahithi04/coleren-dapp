import { useSelector } from "react-redux";
import SelectInvite from "@/components/account/invite";
import EditIcon from "@/components/account/icons/edit";

export default function Frequency() {
  const activeType = useSelector((state) => state.sequence.activeType);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-[#062732] mb-2">
          Feedback Settings
        </h2>
        <p className="text-gray-500 text-sm">
          Choose how often mails will be sent to request feedback and what
          information is included.
        </p>
      </div>

      <div className="grid grid-cols-[200px_1fr] items-center gap-4">
        <SelectInvite options={["Opportunity type"]} />

        <button className="flex items-center gap-2 text-[#25C766] font-medium">
          <EditIcon color="#25C766" size={20} /> View/Edit Email
        </button>
      </div>

      {/* SEND EMAILS */}
      <div>
        <h3 className="text-lg font-semibold text-[#062732] mb-4">
          Send Emails
        </h3>

        <div className="grid grid-cols-[150px_auto_200px_auto_100px_100px_auto_200px_1fr] items-center gap-4">
          <SelectInvite options={["Weekly", "Daily"]} />
          <span>on</span>

          <SelectInvite options={["Monday", "Tuesday", "Wednesday"]} />
          <span>at</span>

          <input
            type="time"
            defaultValue="09:30"
            className="px-3 py-3 mt-2 border border-[#A1A1A180] rounded-lg"
          />

          <SelectInvite value="AM" options={["AM", "PM"]} />
          <span>in</span>

          <SelectInvite options={["Denver, USA"]} />
        </div>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-[200px_70px_150px_auto_190px_1fr] items-center gap-4">
        <span className="text-[#062732]">Only include deals that are</span>

        <input
          type="number"
          defaultValue={0}
          min={0}
          max={10}
          className="px-3 py-3 mt-2 border border-[#A1A1A180] rounded-lg"
        />

        <SelectInvite options={["Days", "Weeks"]} />

        <span>past</span>

        <SelectInvite options={["Denver, USA"]} />
      </div>

      {/* INFO BOX */}
      <div className="bg-[#E7FCEF] text-[#062732] px-4 py-3 rounded-xl">
        7 days batching period. Distributions will begin sending within a 1 hour
        window, after the time established.
      </div>

      {/* CHECKBOX */}
      <div className="flex items-start gap-3">
        <input type="checkbox" className="mt-1 w-5 h-5 accent-[#25C766]" />

        <div>
          <p className="font-medium text-[#062732]">
            Enroll new contacts in feedback automation
          </p>
          <p className="text-gray-500 text-sm">
            Any new contact added by a sales rep that matches your feedback
            criteria will be enrolled in automated feedback requests.
          </p>
        </div>
      </div>
    </div>
  );
}
