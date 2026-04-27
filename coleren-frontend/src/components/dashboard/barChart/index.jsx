export default function BarChart({ score, max = 100, color, value }) {
  const safeScore = score || 0;
  const safeMax = max || 100;
  const pct = Math.min(safeScore / safeMax, 1);
  const totalBars = 4;
  // use ceil so at least 1 bar fills when there's any value
  const filledBars = pct > 0 ? Math.max(1, Math.ceil(pct * totalBars)) : 0;
  const heights = [50, 40, 55, 70];

  return (
    <div className="justify-self-end self-start flex flex-col items-end gap-1">
      <svg width="70" height="72" viewBox="0 0 62 72" fill="none">
        {Array.from({ length: totalBars }).map((_, i) => {
          const barH = heights[i];
          const x = i * 18;
          const y = 72 - barH;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="8"
              height={barH}
              rx="5"
              fill={color}
              opacity={i < filledBars ? 1 : 0.15}
            />
          );
        })}
      </svg>
      {value !== undefined && (
        <span className="text-lg font-semibold text-[#062732] text-center w-full">
          {value}
        </span>
      )}
    </div>
  );
}
