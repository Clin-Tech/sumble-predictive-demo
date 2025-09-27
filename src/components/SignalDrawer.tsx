import React, { useEffect, useRef } from "react";
import type { Org } from "../lib/score";
import { score } from "../lib/score";
import ScoreBadge from "./ScoreBadge";

const SignalDrawer: React.FC<{
  org: Org | null;
  isSaved: boolean;
  onSave: (id: string) => void;
  onUnsave: (id: string) => void;
  onClose: () => void;
  scoreMap: Map<string, { score: number; reasons: string[] }>;
  getOtherSignals: (o: Org) => string[];
}> = ({
  org,
  isSaved,
  onSave,
  onUnsave,
  onClose,
  scoreMap,
  getOtherSignals,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!org) return null;

  const s = scoreMap.get(org.id) ?? score(org);
  const others = getOtherSignals(org);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div
        className="fixed  bg-black/20"
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className="ml-auto h-full w-full max-w-md bg-white shadow-xl ring-1 ring-black/5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 id="drawer-title" className="text-base font-semibold">
            {org.name}
          </h2>
          <button
            className="rounded p-1 text-gray-500 hover:bg-gray-100 focus-ring"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5 p-4">
          <div className="flex items-center justify-between">
            <ScoreBadge score={s.score} large withBand />
            {isSaved ? (
              <button
                onClick={() => onUnsave(org.id)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 focus-ring"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => onSave(org.id)}
                className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-brand-500 focus-ring"
              >
                Save to View
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Domain
              </div>
              <div>{org.domain}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Employees
              </div>
              <div>{org.employees.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Industry
              </div>
              <div>{org.industry ?? "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Growth YoY
              </div>
              <div>{org.signals.orgGrowthYoY}%</div>
            </div>
          </div>

          <section>
            <h3 className="mb-2 text-sm font-semibold">Top reasons</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-800">
              {s.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>

          {others.length > 0 && (
            <details className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Other signals
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {others.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SignalDrawer;
