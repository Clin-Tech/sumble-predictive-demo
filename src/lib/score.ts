// src/lib/score.ts
export type Signals = {
  jobPosts30d: number;
  techAddedWithin60d: string[];
  orgGrowthYoY: number; // percent
  fundingWithin90d: boolean;
  initiativeKeywords: string[];
};

export type Org = {
  id: string;
  name: string;
  domain: string;
  employees: number;
  industry?: string;
  signals: Signals;
};

export const INTEREST_TECH = [
  "Snowflake",
  "Kafka",
  "Terraform",
  "Airflow",
] as const;

type ReasonEntry = { text: string; points: number; order: number };

/**
 * Simple additive scoring per spec.
 * Returns capped score 0..100 and top-3 reason texts.
 */
export function score(org: Org): { score: number; reasons: string[] } {
  const reasons = reasonEntries(org);
  const total = Math.min(
    100,
    reasons.reduce((sum, r) => sum + r.points, 0)
  );
  const top3 = [...reasons]
    .sort((a, b) => b.points - a.points || a.order - b.order)
    .slice(0, 3)
    .map((r) => r.text);
  return { score: total, reasons: top3 };
}

/** All human-readable reasons that contributed (sorted desc). */
export function reasonsAll(org: Org): string[] {
  return reasonEntries(org)
    .sort((a, b) => b.points - a.points || a.order - b.order)
    .map((r) => r.text);
}

function reasonEntries(org: Org): ReasonEntry[] {
  const s = org.signals;
  const entries: ReasonEntry[] = [];

  // 1) Job posts last 30d
  if (s.jobPosts30d >= 5) {
    entries.push({
      text: `${s.jobPosts30d} DE job posts in 30d`,
      points: 40,
      order: 1,
    });
  } else if (s.jobPosts30d >= 2) {
    entries.push({
      text: `${s.jobPosts30d} DE job posts in 30d`,
      points: 25,
      order: 1,
    });
  } else if (s.jobPosts30d === 1) {
    entries.push({
      text: `1 DE job post in 30d`,
      points: 10,
      order: 1,
    });
  }

  // 2) New relevant tech within 60d
  const relevant = s.techAddedWithin60d.filter((t) =>
    INTEREST_TECH.includes(t as any)
  );
  if (relevant.length > 0) {
    entries.push({
      text: `Added ${relevant.join(", ")} within 60d`,
      points: 25,
      order: 2,
    });
  }

  // 3) Headcount YoY
  if (s.orgGrowthYoY >= 5) {
    entries.push({
      text: `Headcount up ${s.orgGrowthYoY}% YoY`,
      points: 15,
      order: 3,
    });
  }

  // 4) Funding/press within 90d
  if (s.fundingWithin90d) {
    entries.push({
      text: "Recent funding/press",
      points: 10,
      order: 4,
    });
  }

  // 5) Initiative keywords
  const kw = (s.initiativeKeywords || []).filter(Boolean);
  if (kw.length >= 2) {
    entries.push({
      text: `Signals: ${kw.join(", ")}`,
      points: 10,
      order: 5,
    });
  } else if (kw.length === 1) {
    entries.push({
      text: `Signal: ${kw[0]}`,
      points: 5,
      order: 5,
    });
  }

  return entries;
}
