export default function BarChart({ score, max, color, value }) {
  const pct = Math.min(score / max, 1);
  const totalBars = 4;
  const filledBars = Math.round(pct * totalBars);
  const heights = [50, 40, 55, 70];

  return (
    <div className="justify-self-end self-start flex flex-col items-end gap-1">
      <svg width="70" height="92" viewBox="0 0 62 92" fill="none">
        {Array.from({ length: totalBars }).map((_, i) => {
          const barH = heights[i];
          const x = i * 18;
          const y = 92 - barH;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="8"
              height={barH}
              rx="5"
              fill={color}
              opacity={i < filledBars ? 1 : 0.2}
            />
          );
        })}
      </svg>
      {value !== undefined && (
        <span className="text-2xl font-semibold text-[#062732] text-center w-full">
          {value}
        </span>
      )}
    </div>
  );
}
