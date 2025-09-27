import React from "react";
import type { Org } from "../lib/score";
import ScoreBadge from "./ScoreBadge";

const Table: React.FC<{
  data: Org[];
  predictiveOn: boolean;
  scoreMap: Map<string, { score: number; reasons: string[] }>;
  onSelect: (o: Org) => void;
}> = ({ data, predictiveOn, scoreMap, onSelect }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Employees</th>
              {predictiveOn && (
                <th className="px-4 py-3 font-medium text-right">Score</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((o) => {
              const s = scoreMap.get(o.id);
              return (
                <tr
                  key={o.id}
                  className={`group ${predictiveOn && "cursor-pointer"} border-t hover:bg-gray-50 focus-within:bg-gray-50`}
                  onClick={() => predictiveOn && onSelect(o)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelect(o);
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {o.name}
                      </span>
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 ring-1 ring-gray-200">
                        {o.industry ?? "General"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{o.domain}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {o.employees.toLocaleString()}
                  </td>
                  {predictiveOn && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex">
                        <ScoreBadge score={s?.score ?? 0} />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td
                  className="px-4 py-12 text-center text-gray-500"
                  colSpan={4}
                >
                  No organizations match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-500">
        Showing {data.length} organizations
      </div>
    </div>
  );
};

export default Table;
