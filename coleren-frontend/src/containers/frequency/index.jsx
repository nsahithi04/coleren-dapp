import InviteDrop from "@/components/common/inviteDropdown";
import EditIcon from "@/components/common/icons/edit";
import CounterControl from "../../components/common/CounterControl";

export default function Frequency() {
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

      <div className="grid grid-cols-[250px_1fr] items-center gap-4">
        <InviteDrop options={["Opportunity type"]} />

        {/* <button className="flex items-center gap-2 text-[#25C766] font-medium">
          <EditIcon color="#25C766" size={20} /> View/Edit Email
        </button> */}
      </div>

      {/* SEND EMAILS */}
      <div>
        <h3 className="text-lg font-semibold text-[#062732] mb-4">
          Send Emails
        </h3>

        <div className="grid grid-cols-[150px_auto_200px_auto_100px_auto_200px_1fr] items-center gap-4">
          <InviteDrop options={["Weekly", "Daily"]} />
          <span>on</span>

          <InviteDrop options={["Monday", "Tuesday", "Wednesday"]} />
          <span>at</span>

          <input
            type="time"
            defaultValue="09:30"
            className="px-3 py-3 border border-[#A1A1A1] rounded-lg"
          />

          <span>in</span>

          <InviteDrop options={["Denver, USA"]} />
        </div>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-[200px_150px_150px_auto_190px_1fr] items-center gap-4">
        <span className="text-[#062732]">Only include deals that are</span>

        <CounterControl />

        <InviteDrop options={["Days", "Weeks"]} />

        <span>past</span>

        <InviteDrop options={["Denver, USA"]} />
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
      <button className="w-fit bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold">
        Submit
      </button>
    </div>
  );
}
