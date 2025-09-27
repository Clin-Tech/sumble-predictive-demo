import { describe, it, expect } from "vitest";
import { score, type Org } from "./score";

const base: Org = {
  id: "x",
  name: "TestCo",
  domain: "t.co",
  employees: 1,
  signals: {
    jobPosts30d: 0,
    techAddedWithin60d: [],
    orgGrowthYoY: 0,
    fundingWithin90d: false,
    initiativeKeywords: [],
  },
};

function calc(overrides: Partial<Org["signals"]>) {
  return score({ ...base, signals: { ...base.signals, ...overrides } });
}

describe("score()", () => {
  it("jobPosts thresholds", () => {
    expect(calc({ jobPosts30d: 0 }).score).toBe(0);
    expect(calc({ jobPosts30d: 1 }).score).toBe(10);
    expect(calc({ jobPosts30d: 2 }).score).toBe(25);
    expect(calc({ jobPosts30d: 4 }).score).toBe(25);
    expect(calc({ jobPosts30d: 5 }).score).toBe(40);
  });

  it("techAdded present/absent", () => {
    expect(calc({ techAddedWithin60d: [] }).score).toBe(0);
    expect(calc({ techAddedWithin60d: ["Snowflake"] }).score).toBe(25);
    expect(calc({ techAddedWithin60d: ["Other"] }).score).toBe(0);
  });

  it("orgGrowth boundary", () => {
    expect(calc({ orgGrowthYoY: 4 }).score).toBe(0);
    expect(calc({ orgGrowthYoY: 5 }).score).toBe(15);
  });

  it("funding toggle", () => {
    expect(calc({ fundingWithin90d: true }).score).toBe(10);
    expect(calc({ fundingWithin90d: false }).score).toBe(0);
  });

  it("initiative keywords", () => {
    expect(calc({ initiativeKeywords: [] }).score).toBe(0);
    expect(calc({ initiativeKeywords: ["LLM"] }).score).toBe(5);
    expect(calc({ initiativeKeywords: ["LLM", "migration"] }).score).toBe(10);
  });

  it("cap at 100 & reasons length <= 3", () => {
    const { score: s, reasons } = calc({
      jobPosts30d: 7, // 40
      techAddedWithin60d: ["Snowflake", "Terraform"], // 25
      orgGrowthYoY: 10, // 15
      fundingWithin90d: true, // 10
      initiativeKeywords: ["LLM", "platform"], // 10
    });
    expect(s).toBe(100);
    expect(reasons.length).toBeLessThanOrEqual(3);
  });
});
