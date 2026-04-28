import InviteDrop from "@/components/common/inviteDropdown";
import CounterControl from "../../components/common/CounterControl";
import { getStates } from "../../services/apiService";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Frequency() {
  const { type } = useParams();
  const [states, setStates] = useState([]);
  const [frequency, setFrequency] = useState({
    sequenceType: "",
    opportunityType: "",
    type: "",
    day: "",
    time: "",
    timezone: "",
    delayCount: 0,
    delayUnit: "",
    delayTimezone: "",
    autoEnroll: false,
  });

  const update = (key, value) => {
    setFrequency((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (type) {
      setFrequency((prev) => ({
        ...prev,
        sequenceType: type,
      }));
    }
  }, [type]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getStates();
        setStates(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStates();
  }, []);

  const handleSubmit = async () => {
    try {
      console.log(frequency);
    } catch (err) {
      console.log(err);
    }
  };

  const stateNames = states.map((s) => [s.name, " , ", s.state_code]);

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
        <InviteDrop
          options={["Opportunity type", "Deal stage", "Deal value"]}
          value={frequency.opportunityType}
          onChange={(e) => update("opportunityType", e.target.value)}
          placeholder="Select type"
        />

        {/* <button className="flex items-center gap-2 text-[#25C766] font-medium">
          <EditIcon color="#25C766" size={20} /> View/Edit Email
        </button> */}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#062732] mb-4">
          Send Emails
        </h3>

        <div className="grid grid-cols-[150px_auto_200px_auto_100px_auto_200px_1fr] items-center gap-4">
          <InviteDrop
            options={["Weekly", "Daily"]}
            value={frequency.type}
            onChange={(e) => update("type", e.target.value)}
          />
          <span>on</span>
          <InviteDrop
            options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]}
            value={frequency.day}
            onChange={(e) => update("day", e.target.value)}
          />
          <span>at</span>
          <input
            type="time"
            value={frequency.time}
            onChange={(e) => update("time", e.target.value)}
            className="px-3 py-3 border border-[#A1A1A1] rounded-lg"
          />
          <span>in</span>
          <InviteDrop
            options={stateNames}
            value={frequency.timezone}
            onChange={(e) => update("timezone", e.target.value)}
            placeholder="Select state"
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="grid grid-cols-[200px_150px_150px_auto_190px_1fr] items-center gap-4">
        <span className="text-[#062732]">Only include deals that are</span>

        <CounterControl
          value={frequency.delayCount}
          onChange={(val) => update("delayCount", val)}
        />
        <InviteDrop
          options={["Days", "Weeks"]}
          value={frequency.delayUnit}
          onChange={(e) => update("delayUnit", e.target.value)}
        />
        <span>past</span>
        <InviteDrop
          options={stateNames}
          value={frequency.delayTimezone}
          onChange={(e) => update("delayTimezone", e.target.value)}
          placeholder="Select state"
        />
      </div>

      <div className="bg-[#E7FCEF] text-[#062732] px-4 py-3 rounded-xl">
        7 days batching period. Distributions will begin sending within a 1 hour
        window, after the time established.
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={frequency.autoEnroll}
          onChange={(e) => update("autoEnroll", e.target.checked)}
          className="mt-1 w-5 h-5 accent-[#25C766]"
        />
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
      <button
        onClick={handleSubmit}
        className="w-fit bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold"
      >
        Submit
      </button>
    </div>
  );
}
