export default function SelectInvite({
  color,
  textColor,
  label,
  value,
  onChange,
  options = [],
}) {
  let selectClass =
    "w-full px-3 py-3 rounded-lg appearance-none pr-5 outline-none focus:outline-none";

  let style = {};

  if (color) {
    style = { backgroundColor: color, color: textColor, fontWeight: "500" };
    selectClass += " border-0";
  } else {
    selectClass += " border border-[#A1A1A180]";
  }
  return (
    <div>
      <p className="text-sm font-medium pb-2">{label}</p>

      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          style={style}
          className={selectClass}
        >
          <option value="" disabled></option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5 33H22.5C30 33 33 30 33 22.5V13.5C33 6 30 3 22.5 3H13.5C6 3 3 6 3 13.5V22.5C3 30 6 33 13.5 33Z"
              fill="#E7FCEF"
            />
            <path
              d="M12.7051 15.96L18.0001 21.24L23.2951 15.96"
              stroke="#25C766"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
