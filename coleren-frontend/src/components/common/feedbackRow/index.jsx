import Button from "../../dashboard/button";
import { TYPE_STYLE, PHASE_STYLE, OUTCOME_STYLE } from "../../../utils/styles";

export default function FeedbackRow({ row, isActive, onClick }) {
  const typeStyle = TYPE_STYLE[row.type] || TYPE_STYLE["SALES REP"];
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
        <Button label={row.type} color={typeStyle.bg} text={typeStyle.text} />
      </td>
      <td className="py-4 px-5">
        <Button
          label={row.phase}
          color={phaseStyle.bg}
          text={phaseStyle.text}
        />
      </td>
      <td className="py-4 px-5">
        <Button
          label={row.outcome}
          color={outcomeStyle.bg}
          text={outcomeStyle.text}
        />
      </td>
      <td className="py-4 px-5 text-md">
        {new Date(row.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="py-4 px-5 text-md">{row.salesRep}</td>
    </tr>
  );
}
