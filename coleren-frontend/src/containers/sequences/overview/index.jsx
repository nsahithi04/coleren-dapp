import { useState } from "react";
import { useSelector } from "react-redux";
import Toggle from "@/components/account/toggle";

export default function Overview() {
  const activeType = useSelector((state) => state.sequence.activeType);
  const [active, setActive] = useState(true);

  return (
    <div>
      <div className="border border-gray-200 rounded-xl p-5 flex items-center justify-between">
        {/* Left */}
        <div>
          <p className="text-md font-semibold text-[#062732]">
            Automate Outcome Rules
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M16.5 9C16.5 13.14 13.14 16.5 9 16.5C4.86 16.5 2.3325 12.33 2.3325 12.33M2.3325 12.33H5.7225M2.3325 12.33V16.08M1.5 9C1.5 4.86 4.83 1.5 9 1.5C14.0025 1.5 16.5 5.67 16.5 5.67M16.5 5.67V1.92M16.5 5.67H13.17"
                  stroke="#062732"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>

            <span className="text-xs text-gray-400">Modified: 3 days ago</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Toggle checked={active} onChange={() => setActive((v) => !v)} />
          <span className="text-sm font-semibold text-[#25C766]">
            {active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
