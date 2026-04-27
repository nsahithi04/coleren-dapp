export default function Button({ label, color, text, arrow, icon }) {
  return (
    <div
      className="flex items-center gap-2 p-2 w-fit h-fit rounded font-medium"
      style={{ background: color, color: text }}
    >
      {icon && icon}
      {label}
      {arrow && (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="#062732"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
