import InviteDrop from "@/components/common/inviteDropdown";
import MultiTagInput from "@/components/common/MultiTagInput";
import CounterControl from "../../components/common/CounterControl";
import { useState } from "react";

export default function Rules() {
  const [tags, setTags] = useState([]);
  const [rule, setRule] = useState({
    type: "",
    operator: "",
    tags: [],
    logic: "AND",
    dateField: "",
    dateCondition: "",
    value: 0,
    unit: "Days",
  });

  const OPPORTUNITY_TYPES = ["New Business", "Existing Customer", "Expansion"];
  const OPERATORS = [
    "Includes",
    "Does not include",
    "Equals",
    "Not equals",
    "Starts with",
    "Ends with",
    "Contains any of",
    "Contains all of",
    "Is empty",
    "Is not empty",
  ];

  const DATE_FIELDS = [
    "Created Date",
    "Closed Date",
    "Last Activity Date",
    "Follow-up Date",
    "Demo Scheduled Date",
    "Contract Sent Date",
  ];

  const DATE_CONDITIONS = [
    "is in last",
    "is not in last",
    "is exactly",
    "is before",
    "is after",
    "is between",
  ];

  const TIME_UNITS = ["Days", "Weeks", "Months", "Years"];

  const updateRule = (key, value) => {
    setRule((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid gap-8">
      <div>
        Set rules to determine which sales reps receive feedback invitations.
      </div>
      <div className="p-4 bg-[#E7FCEF80] rounded-md">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </div>
      <div className="grid gap-3">
        <div className="text-lg font-semibold">Feedback Rules</div>
        <div>Request feedback from contacts for deals where:</div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-5">
        <InviteDrop
          value={rule.type}
          placeholder="Select an option"
          onChange={(e) => updateRule("type", e.target.value)}
          options={OPPORTUNITY_TYPES}
        />

        <InviteDrop
          value={rule.operator}
          placeholder="Select an option"
          onChange={(e) => updateRule("operator", e.target.value)}
          options={OPERATORS}
        />

        <MultiTagInput
          value={rule.tags}
          onChange={(val) => updateRule("tags", val)}
        />
      </div>
      <div className="grid grid-cols-[120px_1fr_1fr_130px_130px] gap-5">
        <InviteDrop
          value={rule.logic}
          placeholder="Select an option"
          onChange={(e) => updateRule("logic", e.target.value)}
          options={["AND", "OR"]}
          color="#E7FCEF"
          textColor="#15BA92"
        />

        <InviteDrop
          value={rule.dateField}
          placeholder="Select an option"
          onChange={(e) => updateRule("dateField", e.target.value)}
          options={DATE_FIELDS}
        />

        <InviteDrop
          value={rule.dateCondition}
          placeholder="Select an option"
          onChange={(e) => updateRule("dateCondition", e.target.value)}
          options={DATE_CONDITIONS}
        />

        <CounterControl
          value={rule.value}
          onChange={(val) => updateRule("value", val)}
        />

        <InviteDrop
          value={rule.unit}
          placeholder="Select an option"
          onChange={(e) => updateRule("unit", e.target.value)}
          options={TIME_UNITS}
        />
      </div>
      <div>
        Make sure filters are specific so there isn’t a conflict with other
        feedback requests.
      </div>

      <button className="w-fit bg-[#25C766] text-white py-3 px-5 rounded-lg text-md font-semibold">
        Submit
      </button>
    </div>
  );
}
