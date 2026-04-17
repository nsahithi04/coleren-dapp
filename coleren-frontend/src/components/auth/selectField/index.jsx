export default function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div>
      <p className="text-sm font-medium pb-2">{label}</p>

      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          className="w-full p-5 border border-[#A1A1A1] rounded-lg appearance-none bg-white pr-12"
        >
          <option value="" disabled></option>

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="#555555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
