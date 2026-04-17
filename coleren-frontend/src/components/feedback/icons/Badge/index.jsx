export default function Badge({ label, bg, text, border }) {
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-2 rounded text-sm font-semibold tracking-wide"
      style={{
        background: bg,
        color: text,
        border: border ? `1px solid ${border}` : "none",
        minWidth: 72,
      }}
    >
      {label}
    </span>
  );
}
