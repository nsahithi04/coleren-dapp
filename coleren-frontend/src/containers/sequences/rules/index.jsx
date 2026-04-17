import { useSelector, useDispatch } from "react-redux";
import { setActiveType } from "@/store/sequenceSlice";
import SelectInvite from "@/components/account/invite";
import CounterControl from "@/components/sequences/CounterControl";
import MultiTagInput from "@/components/sequences/MultiTagInput";

export default function Rules() {
  const ROLES = [
    "Product",
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "Operations",
    "Other",
  ];

  const dispatch = useDispatch();
  const activeType = useSelector((state) => state.sequence.activeType);

  return (
    <div className="grid gap-8 p-10 border border-gray-200 rounded-xl">
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
        <SelectInvite
          onChange={(e) => updateRow(i, "role", e.target.value)}
          options={ROLES}
        />
        <SelectInvite
          onChange={(e) => updateRow(i, "role", e.target.value)}
          options={ROLES}
        />
        <MultiTagInput />
      </div>
      <div className="grid grid-cols-[100px_1fr_1fr_130px] gap-5">
        <SelectInvite
          onChange={(e) => updateRow(i, "role", e.target.value)}
          options={["AND", "OR"]}
          color="#E7FCEF"
          textColor="#15BA92"
        />
        <SelectInvite
          onChange={(e) => updateRow(i, "role", e.target.value)}
          options={ROLES}
        />
        <SelectInvite
          onChange={(e) => updateRow(i, "role", e.target.value)}
          options={ROLES}
        />
        <CounterControl value={0} />
      </div>
      <div>
        Make sure filters are specific so there isn’t a conflict with other
        feedback requests.
      </div>
    </div>
  );
}
