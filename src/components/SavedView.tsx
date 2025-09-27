import React from "react";
import type { Org } from "../lib/score";

type Item = { org: Org; score: number };

const SavedView: React.FC<{
  title: string;
  items: Item[];
  onOpen: (org: Org) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}> = ({ title, items, onOpen, onRemove, onClear }) => {
  const count = items.length;

  return (
    <footer className="sticky bottom-0 z-20 border-t border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-screen-2xl px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
              Saved View
            </span>
            <span className="text-sm text-gray-800">
              {title} <span className="text-gray-500">({count})</span>
            </span>
          </div>

          <button
            onClick={onClear}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus-ring disabled:opacity-50"
            disabled={count === 0}
          >
            Clear
          </button>
        </div>

        {/* chips */}
        <div className="mt-2 overflow-x-auto">
          {count === 0 ? (
            <div className="text-xs text-gray-500 py-1">
              No organizations saved yet.
            </div>
          ) : (
            <ul className="flex items-center gap-2 pr-1 pb-1">
              {items.map(({ org, score }) => (
                <li key={org.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpen(org)}
                    onKeyDown={(e) => e.key === "Enter" && onOpen(org)}
                    className="group inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white pl-2 pr-1 py-1 text-xs shadow-sm hover:bg-gray-50 focus-ring"
                    title="Open details"
                  >
                    <span className="font-medium text-gray-800 truncate max-w-[10rem]">
                      {org.name}
                    </span>
                    <span className="rounded border border-gray-200 bg-gray-50 px-1 py-[2px] text-[10px] font-semibold text-gray-900">
                      {score}
                    </span>
                    <button
                      className="ml-1 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      title="Remove from saved"
                      aria-label={`Remove ${org.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(org.id);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          fill="currentColor"
                          d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};

export default SavedView;
