import Toggle from "../../components/common/toggle";
import { useState } from "react";

export default function Overview() {
  const [active, setActive] = useState(true);

  return (
    <div className="flex justify-between">
      <div>
        <p className="font-semibold text-LG">Automate Outcome Rules</p>
        <p className="text-sm text-gray-400">Modified: 3 days ago</p>
      </div>

      <div className="flex items-center gap-2">
        <Toggle checked={active} onChange={setActive} />
        <span>{active ? "Active" : "Inactive"}</span>
      </div>
    </div>
  );
}
