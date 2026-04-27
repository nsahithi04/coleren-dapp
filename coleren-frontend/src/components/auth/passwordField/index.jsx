import { useState } from "react";
import EyeIcon from "../icons/openEyeIcon";
import CloseEyeIcon from "../icons/closeEyeIcon";

export default function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  let inputStyle = "border-[#A1A1A1]";
  let labelStyle = "";

  if (error) {
    labelStyle = "text-[#E94055]";
    inputStyle = "border-[#E94055]";
  } else if (value) {
    labelStyle = "text-[#25C766]";
    inputStyle = "border-[#25C766]";
  }

  return (
    <div>
      <p className={`text-sm font-medium pb-2 ${labelStyle}`}>{label}</p>
      <div className="relative">
        <input
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={value}
          className={`w-full p-5 pr-12 border rounded-lg ${inputStyle}`}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#062732]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeIcon /> : <CloseEyeIcon />}
        </button>
      </div>
    </div>
  );
}
