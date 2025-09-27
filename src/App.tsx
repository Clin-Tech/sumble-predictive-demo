import React, { useEffect, useMemo, useState } from "react";
import { score, reasonsAll, type Org } from "./lib/score";
import Toggle from "./components/Toggle";
import Search from "./components/Search";
import Table from "./components/Table";
import SignalDrawer from "./components/SignalDrawer";
import SavedView from "./components/SavedView";

type SavedViewData = {
  shortlist: string[];
  filters: { search: string; predictiveOn: boolean };
};

const LS_KEY = "sumble-demo-saved-view";

function loadSaved(): SavedViewData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw)
      return { shortlist: [], filters: { search: "", predictiveOn: false } };
    const parsed = JSON.parse(raw) as SavedViewData;
    return {
      shortlist: parsed.shortlist ?? [],
      filters: parsed.filters ?? { search: "", predictiveOn: false },
    };
  } catch {
    return { shortlist: [], filters: { search: "", predictiveOn: false } };
  }
}

const App: React.FC = () => {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictiveOn, setPredictiveOn] = useState<boolean>(
    loadSaved().filters.predictiveOn
  );
  const [search, setSearch] = useState<string>(loadSaved().filters.search);
  const [selected, setSelected] = useState<Org | null>(null);
  const [shortlist, setShortlist] = useState<string[]>(loadSaved().shortlist);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/mock/orgs.json");
        const data = (await res.json()) as Org[];
        if (mounted) setOrgs(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // persist saved view
  useEffect(() => {
    const payload: SavedViewData = {
      shortlist,
      filters: { search, predictiveOn },
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }, [shortlist, search, predictiveOn]);

  // map of scores for quick access
  const scoreMap = useMemo(() => {
    const m = new Map<string, { score: number; reasons: string[] }>();
    for (const o of orgs) m.set(o.id, score(o));
    return m;
  }, [orgs]);

  // filtered list for table
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    let list = orgs.filter((o) => o.name.toLowerCase().includes(needle));
    if (predictiveOn) {
      list = [...list].sort(
        (a, b) =>
          (scoreMap.get(b.id)?.score ?? 0) - (scoreMap.get(a.id)?.score ?? 0)
      );
    }
    return list;
  }, [orgs, search, predictiveOn, scoreMap]);

  // shortlist operations
  const onSaveOrg = (orgId: string) =>
    setShortlist((prev) => (prev.includes(orgId) ? prev : [...prev, orgId]));
  const removeFromShortlist = (orgId: string) =>
    setShortlist((prev) => prev.filter((id) => id !== orgId));
  const clearSaved = () => setShortlist([]);

  // compute saved org models with scores
  const savedItems = useMemo(
    () =>
      orgs
        .filter((o) => shortlist.includes(o.id))
        .map((o) => ({ org: o, score: scoreMap.get(o.id)?.score ?? 0 })),
    [orgs, shortlist, scoreMap]
  );

  // expand desktop width when predictive is off (reduces blank space)
  const containerMax = predictiveOn ? "max-w-6xl" : "max-w-screen-2xl";

  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
        <div
          className={`mx-auto w-full ${containerMax} px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3`}
        >
          <div className="text-base font-semibold tracking-tight">
            Predictive Insights — <span className="text-brand-600">Sumble</span>{" "}
            Extension
          </div>
          <div className="ml-0 sm:ml-auto flex items-center gap-2">
            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search organizations…"
            />
            <Toggle
              checked={predictiveOn}
              onChange={setPredictiveOn}
              label="Predictive"
              ariaLabel="Toggle predictive insights"
            />
          </div>
        </div>
      </header>

      <main className={`mx-auto ${containerMax} w-full px-4 py-4 flex-1`}>
        {loading ? (
          <div className="py-24 text-center text-gray-500">
            Loading organizations…
          </div>
        ) : (
          <Table
            predictiveOn={predictiveOn}
            data={filtered}
            scoreMap={scoreMap}
            onSelect={(o) => setSelected(o)}
          />
        )}
      </main>

      <SavedView
        title="Saved View: Data Eng – Q4 Targets"
        items={savedItems}
        onOpen={(org) => setSelected(org)}
        onRemove={(id) => removeFromShortlist(id)}
        onClear={clearSaved}
      />

      <SignalDrawer
        org={selected}
        isSaved={!!selected && shortlist.includes(selected.id)}
        onSave={(id) => onSaveOrg(id)}
        onUnsave={(id) => removeFromShortlist(id)}
        onClose={() => setSelected(null)}
        scoreMap={scoreMap}
        getOtherSignals={(o) => {
          const all = reasonsAll(o);
          const top3 = score(o).reasons;
          return all.filter((r) => !top3.includes(r));
        }}
      />
    </div>
  );
};

export default App;
