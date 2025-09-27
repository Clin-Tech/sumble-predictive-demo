import React from "react";

export function band(score: number): "High" | "Medium" | "Low" {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

function bandColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800 ring-green-200";
  if (score >= 60) return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-gray-100 text-gray-800 ring-gray-200";
}

const ScoreBadge: React.FC<{
  score: number;
  large?: boolean;
  withBand?: boolean;
}> = ({ score, large, withBand }) => {
  const b = band(score);
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-md border border-gray-200 bg-white font-semibold text-gray-900 ring-1 ring-gray-100 ${
          large ? "h-14 w-14 text-xl" : "h-8 w-10 text-sm"
        }`}
      >
        {score}
      </span>
      {withBand && (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ${bandColor(
            score
          )}`}
        >
          {b} confidence
        </span>
      )}
    </div>
  );
};

export default ScoreBadge;
