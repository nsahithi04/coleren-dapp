import CalendarIcon from "@/components/feedback/icons/CalendarIcon";
import UserIcon from "@/components/feedback/icons/UserIcon";
import RepIcon from "@/components/feedback/icons/RepIcon";
import PhaseIcon from "@/components/feedback/icons/PhaseIcon";
import OutcomeIcon from "@/components/feedback/icons/OutcomeIcon";
import Badge from "@/components/feedback/icons/Badge";

const PHASE_STYLE = {
  "IN PROGRESS": { bg: "#F8F8F8", text: "#062732" },
  NEW: { bg: "#C9F1DC", text: "#062732" },
  CLOSED: { bg: "#C9EFF1", text: "#062732" },
};

const OUTCOME_STYLE = {
  WIN: { bg: "#24BC61", text: "#ffffff" },
  LOSS: { bg: "#DC3D51", text: "#ffffff" },
  TBD: { bg: "#FFD028", text: "#000000" },
};

function MetaRow({ icon, label, value, badge }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-gray-300 flex-shrink-0">{icon}</span>
      <span className="text-sm text-gray-500 w-20 flex-shrink-0">{label}</span>
      {badge ?? (
        <span className="text-sm font-medium text-[#062732]">{value}</span>
      )}
    </div>
  );
}

export default function FeedbackDetailPanel({ row }) {
  if (!row)
    return (
      <div
        className="bg-white rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center"
        style={{ width: 300, minHeight: 200 }}
      >
        <p className="text-sm text-gray-300">Select a row to view feedback</p>
      </div>
    );

  const isRep = row.type === "SALES REP";
  const phaseStyle = PHASE_STYLE[row.phase];
  const outcomeStyle = OUTCOME_STYLE[row.outcome];

  return (
    <div
      className="bg-white rounded-xl h-full"
      style={{
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div className="p-4 grid gap-5">
        <div className="bg-[#E7FCEF] p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Feedback report</p>
          <h2 className="text-xl font-semibold text-[#062732] leading-snug">
            {isRep ? "Representative Interview" : "Call Summary"} for{" "}
            <span className="text-[#24BC61]">{row.client}</span>
          </h2>
        </div>
        <div className="border border-gray-100  rounded-lg p-2">
          {/* Meta — created / customer / sales rep */}
          <div className="px-4 pt-1 pb-2 border-b border-gray-100">
            <MetaRow icon={<CalendarIcon />} label="Created" value={row.date} />
            <MetaRow icon={<RepIcon />} label="Customer" value={row.client} />
            <MetaRow
              icon={<UserIcon />}
              label="Sales Rep"
              value={row.salesRep}
            />
          </div>

          {/* Meta — phase / outcome */}
          <div className="px-4 pt-1 pb-2 ">
            <MetaRow
              icon={<PhaseIcon />}
              label="Phase"
              badge={
                <Badge
                  label={row.phase}
                  bg={phaseStyle.bg}
                  text={phaseStyle.text}
                  border={phaseStyle.border}
                />
              }
            />
            <MetaRow
              icon={<OutcomeIcon />}
              label="Outcome"
              badge={
                <Badge
                  label={row.outcome}
                  bg={outcomeStyle.bg}
                  text={outcomeStyle.text}
                />
              }
            />
          </div>
        </div>

        {row.positives?.length > 0 && (
          <div className="rounded-lg overflow-hidden border border-green-100 bg-[#E7FCEF]">
            <div className="px-4 pt-2">
              <span className="text-md font-bold tracking-widest text-[#15BA92]">
                POSITIVES
              </span>
            </div>
            <ul className="px-4 py-3 space-y-2">
              {row.positives.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-gray-700"
                >
                  <span
                    className="mt-1.5 flex-shrink-0 rounded-full"
                    style={{ width: 7, height: 7, background: "#15BA92" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Negatives */}
        {row.negatives?.length > 0 && (
          <div className="rounded-lg overflow-hidden bg-[#FFF8F9]">
            <div className="px-4 py-2 ">
              <span className="text-md font-bold tracking-widest text-red-500">
                NEGATIVES
              </span>
            </div>
            <ul className="px-4 py-3 space-y-2">
              {row.negatives.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-gray-700"
                >
                  <span
                    className="mt-1.5 flex-shrink-0 rounded-full"
                    style={{ width: 7, height: 7, background: "#E94055" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* View Feedback CTA */}
        <div>
          <button className="w-fit flex gap-5 items-center justify-between px-4 py-1 rounded-lg border  text-sm font-medium text-[#062732] hover:bg-gray-50 transition-colors">
            View Feedback
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33 22.5L33 13.5C33 6 30 3 22.5 3L13.5 3C6 3 3 6 3 13.5L3 22.5C3 30 6 33 13.5 33L22.5 33C30 33 33 30 33 22.5Z"
                fill="#E7FCEF"
              />
              <path
                d="M15.96 23.2949L21.24 17.9999L15.96 12.7049"
                stroke="#25C766"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
