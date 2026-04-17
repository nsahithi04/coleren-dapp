import Badge from "../icons/Badge";

const TYPE_STYLE = {
  "SALES REP": { bg: "#D8EBE0", text: "#000000" },
  "CALL SUMMARY": { bg: "#25AB83", text: "#ffffff" },
};

const PHASE_STYLE = {
  "IN PROGRESS": { bg: "#F8F8F8", text: "#062732" },
  NEW: { bg: "#C9F1DC", text: "#062732" },
  CLOSED: { bg: "#C9EFF1", text: "#062732" },
};

const OUTCOME_STYLE = {
  WIN: { bg: "#2BB289", text: "#ffffff" },
  LOSS: { bg: "#DC3D51", text: "#ffffff" },
  TBD: { bg: "#FFD028", text: "#000000" },
};

export default function FeedbackRow({ row, isActive, onClick }) {
  const typeStyle = TYPE_STYLE[row.type];
  const phaseStyle = PHASE_STYLE[row.phase];
  const outcomeStyle = OUTCOME_STYLE[row.outcome];

  return (
    <tr
      onClick={onClick}
      className="border-t border-gray-100 cursor-pointer transition-colors hover:bg-gray-50/70"
      style={
        isActive
          ? {
              outline: "1.5px solid #25C766",
              boxShadow: "0px 0px 5px 0px #25C766",
              outlineOffset: -1,
              borderRadius: 10,
            }
          : {}
      }
    >
      <td className="py-4 px-5 font-semibold text-[#062732] text-md">
        {row.client}
      </td>
      <td className="py-4 px-5">
        <Badge
          label={row.type}
          bg={typeStyle.bg}
          text={typeStyle.text}
          border={typeStyle.border}
        />
      </td>
      <td className="py-4 px-5">
        <Badge
          label={row.phase}
          bg={phaseStyle.bg}
          text={phaseStyle.text}
          border={phaseStyle.border}
        />
      </td>
      <td className="py-4 px-5">
        <Badge
          label={row.outcome}
          bg={outcomeStyle.bg}
          text={outcomeStyle.text}
        />
      </td>
      <td className="py-4 px-5 text-sm text-gray-400">{row.date}</td>
      <td className="py-4 px-5 text-sm text-gray-600">{row.salesRep}</td>
    </tr>
  );
}
