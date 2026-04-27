export default function RingChart({ score, max, color }) {
  const r = 34;
  const circ = 3 * Math.PI * r;
  const filled = (score / max) * circ;

  return (
    <div className="w-fit rounded-full justify-self-end">
      <div className="relative w-25 h-25">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            transform="rotate(-90 60 60)"
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="flex items-center justify-center rounded-full w-15 h-15"
            style={{ boxShadow: `0 0 15px ${color}` }}
          >
            <span className="text-4xl font-medium text-[#062732]">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
