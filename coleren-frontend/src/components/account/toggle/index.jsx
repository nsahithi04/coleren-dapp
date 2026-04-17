export default function Toggle({ checked = false, onChange, label }) {
  const handleToggle = () => {
    onChange?.(!checked);
  };

  let trackClass =
    "relative w-[58px] h-[32px] rounded-full transition-colors duration-200 bg-[#CFCFCF]";

  let thumbClass =
    "absolute top-[3px] left-[3px] w-[26px] h-[26px] bg-white rounded-full shadow transition-all duration-200";

  if (checked) {
    trackClass =
      "relative w-[58px] h-[32px] rounded-full transition-colors duration-200 bg-[#3ecf8e]";

    thumbClass =
      "absolute top-[3px] left-[29px] w-[26px] h-[26px] bg-white rounded-full shadow transition-all duration-200";
  }

  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none focus:outline-none"
      onClick={handleToggle}
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && handleToggle()}
    >
      <div className={trackClass}>
        <div className={thumbClass} />
      </div>

      {label && <span className="text-sm text-gray-700">{label}</span>}
    </div>
  );
}
