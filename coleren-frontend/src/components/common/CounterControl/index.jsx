import { useState } from "react";

export default function CounterControl({
  value = 14,
  onChange,
  min = 0,
  max = 100,
}) {
  const [count, setCount] = useState(value);

  function handleDecrease() {
    if (count <= min) return;

    const newValue = count - 1;
    setCount(newValue);

    if (onChange) onChange(newValue);
  }

  function handleIncrease() {
    if (count >= max) return;

    const newValue = count + 1;
    setCount(newValue);

    if (onChange) onChange(newValue);
  }

  return (
    <div className="w-full h-fit border border-[#A1A1A1] rounded-lg px-3 py-2 flex items-center justify-between bg-white">
      <button
        onClick={handleDecrease}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF7F8]"
      >
        <span className="text-[#D64750] text-xl font-semibold">—</span>
      </button>

      <p className="text-md font-medium text-black">{count}</p>

      <button
        onClick={handleIncrease}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#E7FCEF]"
      >
        <span className="text-[#24BC61] text-xl font-semibold">+</span>
      </button>
    </div>
  );
}
