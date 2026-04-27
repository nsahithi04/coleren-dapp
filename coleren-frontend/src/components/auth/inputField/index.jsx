import ErrorIcon from "./errorIcon";
import SuccessIcon from "./sucessIcon";

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
}) {
  let inputStyle = "border-[#A1A1A1]";
  let labelStyle = "";
  let svg = "";

  if (error) {
    labelStyle = "text-[#E94055]";
    inputStyle = "border-[#E94055]";
    svg = <ErrorIcon />;
  } else if (value) {
    labelStyle = "text-[#25C766]";
    inputStyle = "border-[#25C766]";
    svg = <SuccessIcon />;
  }
  return (
    <div>
      <p className={`text-sm font-medium pb-2 ${labelStyle}`}>{label}</p>
      <div className="relative">
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          className={`w-full p-5 pr-12 border rounded-lg ${inputStyle}`}
          onChange={onChange}
        />

        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#062732]">
          {svg}
        </div>
      </div>
    </div>
  );
}
