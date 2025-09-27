import React from "react";

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  ariaLabel?: string;
}> = ({ checked, onChange, label, ariaLabel }) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <span
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-green-600" : "bg-gray-300"
        } focus-ring`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </span>
    </label>
  );
};

export default Toggle;
