import Button from "@/components/dashboard/button";
import RingChart from "@/components/dashboard/ringChart";
import BarChart from "@/components/dashboard/barChart";

const TYPE_CONFIG = {
  strong: {
    color: "#25C766",
    textColor: "#ffffff",
    label: "STRONG",
    shadow: "rgba(37,199,102,0.35)",
  },
  weak: {
    color: "#E94055",
    textColor: "#ffffff",
    label: "WEAK",
    shadow: "rgba(233,64,85,0.35)",
  },
  avg: {
    color: "#FFD028",
    textColor: "#000000",
    label: "AVG",
    shadow: "rgba(255,208,40,0.35)",
  },
  none: {
    color: "#F8F8F8",
    textColor: "#062732",
    label: "responses",
    shadow: "none",
  },
};

const TYPE_ICONS = {
  strong: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
        fill="#25C766"
        stroke="#25C766"
        strokeWidth="0.5"
      />
      <path
        d="M12 16.25C11.59 16.25 11.25 15.91 11.25 15.5V9.5C11.25 9.09 11.59 8.75 12 8.75C12.41 8.75 12.75 9.09 12.75 9.5V15.5C12.75 15.91 12.41 16.25 12 16.25Z"
        fill="#25C766"
        stroke="#25C766"
        strokeWidth="0.5"
      />
      <path
        d="M15.0004 12.25C14.8104 12.25 14.6204 12.18 14.4704 12.03L12.0004 9.56L9.53043 12.03C9.24043 12.32 8.76043 12.32 8.47043 12.03C8.18043 11.74 8.18043 11.26 8.47043 10.97L11.4704 7.97C11.7604 7.68 12.2404 7.68 12.5304 7.97L15.5304 10.97C15.8204 11.26 15.8204 11.74 15.5304 12.03C15.3804 12.18 15.1904 12.25 15.0004 12.25Z"
        fill="#25C766"
        stroke="#25C766"
        strokeWidth="0.5"
      />
    </svg>
  ),
  weak: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transform: "rotate(180deg)" }}
    >
      <path
        d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
        fill="#E94055"
        stroke="#E94055"
        strokeWidth="0.5"
      />
      <path
        d="M12 16.25C11.59 16.25 11.25 15.91 11.25 15.5V9.5C11.25 9.09 11.59 8.75 12 8.75C12.41 8.75 12.75 9.09 12.75 9.5V15.5C12.75 15.91 12.41 16.25 12 16.25Z"
        fill="#E94055"
        stroke="#E94055"
        strokeWidth="0.5"
      />
      <path
        d="M15.0004 12.25C14.8104 12.25 14.6204 12.18 14.4704 12.03L12.0004 9.56L9.53043 12.03C9.24043 12.32 8.76043 12.32 8.47043 12.03C8.18043 11.74 8.18043 11.26 8.47043 10.97L11.4704 7.97C11.7604 7.68 12.2404 7.68 12.5304 7.97L15.5304 10.97C15.8204 11.26 15.8204 11.74 15.5304 12.03C15.3804 12.18 15.1904 12.25 15.0004 12.25Z"
        fill="#E94055"
        stroke="#E94055"
        strokeWidth="0.5"
      />
    </svg>
  ),
  avg: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 14.75C11.59 14.75 11.25 14.41 11.25 14V9C11.25 8.59 11.59 8.25 12 8.25C12.41 8.25 12.75 8.59 12.75 9V14C12.75 14.41 12.41 14.75 12 14.75Z"
        fill="#062732"
      />
      <path
        d="M12 18C11.94 18 11.87 17.99 11.8 17.98C11.74 17.97 11.68 17.95 11.62 17.92C11.56 17.9 11.5 17.87 11.44 17.83C11.39 17.79 11.34 17.75 11.29 17.71C11.11 17.52 11 17.26 11 17C11 16.74 11.11 16.48 11.29 16.29C11.34 16.25 11.39 16.21 11.44 16.17C11.5 16.13 11.56 16.1 11.62 16.08C11.68 16.05 11.74 16.03 11.8 16.02C11.93 15.99 12.07 15.99 12.19 16.02C12.26 16.03 12.32 16.05 12.38 16.08C12.44 16.1 12.5 16.13 12.56 16.17C12.61 16.21 12.66 16.25 12.71 16.29C12.89 16.48 13 16.74 13 17C13 17.26 12.89 17.52 12.71 17.71C12.66 17.75 12.61 17.79 12.56 17.83C12.5 17.87 12.44 17.9 12.38 17.92C12.32 17.95 12.26 17.97 12.19 17.98C12.13 17.99 12.06 18 12 18Z"
        fill="#062732"
      />
      <path
        d="M18.0605 22.16H5.94046C3.99046 22.16 2.50046 21.45 1.74046 20.17C0.990464 18.89 1.09046 17.24 2.04046 15.53L8.10046 4.63C9.10046 2.83 10.4805 1.84 12.0005 1.84C13.5205 1.84 14.9005 2.83 15.9005 4.63L21.9605 15.54C22.9105 17.25 23.0205 18.89 22.2605 20.18C21.5005 21.45 20.0105 22.16 18.0605 22.16ZM12.0005 3.34C11.0605 3.34 10.1405 4.06 9.41046 5.36L3.36046 16.27C2.68046 17.49 2.57046 18.61 3.04046 19.42C3.51046 20.23 4.55046 20.67 5.95046 20.67H18.0705C19.4705 20.67 20.5005 20.23 20.9805 19.42C21.4605 18.61 21.3405 17.5 20.6605 16.27L14.5905 5.36C13.8605 4.06 12.9405 3.34 12.0005 3.34Z"
        fill="#062732"
      />
    </svg>
  ),
};

export default function ScoreCard({
  title,
  subtitle,
  score,
  max,
  responses,
  value,
  type,
  displayType,
  isActive,
  onClick,
}) {
  const normalizedType = type?.toLowerCase() || "none";
  const cfg = TYPE_CONFIG[normalizedType] || TYPE_CONFIG.none;
  const color = cfg ? cfg.color : "#F8F8F8";

  let style;

  if (isActive) {
    style = {
      borderColor: color,
      boxShadow: `0 0 15px ${color}`,
    };
  } else {
    style = {
      borderColor: "#F8F8F8",
      boxShadow: "none",
    };
  }

  return (
    <div
      onClick={onClick}
      className="h-full border rounded-lg p-5 grid grid-cols-2 gap-5 cursor-pointer transition-all"
      style={style}
    >
      <div>
        <p className="font-semibold text-xl">{title}</p>
        <p className="text-[#062732] text-sm opacity-50">{subtitle}</p>
      </div>

      {displayType === "ring" && (
        <RingChart score={score} max={max} color={color} />
      )}
      {displayType === "bars" && (
        <BarChart score={score} max={max} color={color} value={value} />
      )}

      <div className="self-end justify-self-start">
        <Button
          label={responses}
          color={displayType === "ring" ? "#F8F8F8" : color + "33"}
          text="black"
          arrow={true}
          icon={displayType !== "ring" ? TYPE_ICONS[normalizedType] : null}
        />
      </div>

      <div className="self-end justify-self-end">
        <Button
          label={cfg.label}
          color={color}
          text={cfg.textColor}
          arrow={false}
        />
      </div>
    </div>
  );
}
