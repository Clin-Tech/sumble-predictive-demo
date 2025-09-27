import React, { useEffect, useRef, useState } from "react";

const Search: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [inner, setInner] = useState(value);
  const t = useRef<number | null>(null);

  useEffect(() => setInner(value), [value]);

  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => onChange(inner), 250);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [inner, onChange]);

  return (
    <div className="w-full relative">
      <input
        className="w-50 sm:w-60 md:w-72 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-ring"
        placeholder={placeholder}
        value={inner}
        onChange={(e) => setInner(e.target.value)}
        aria-label="Search organizations by name"
      />
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14Z"
        />
      </svg>
    </div>
  );
};

export default Search;
