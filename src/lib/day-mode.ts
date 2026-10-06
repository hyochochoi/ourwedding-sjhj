export type DayMode = "normal" | "day" | "after";
export type SectionId = "invitation" | "gallery" | "date" | "location" | "info" | "gift" | "stars" | "photos" | "rsvp";

const NORMAL: SectionId[] = ["invitation", "gallery", "date", "location", "info", "gift", "stars", "photos", "rsvp"];
const DAY_FIRST: SectionId[] = ["date", "location", "stars", "photos"];
const AFTER_FIRST: SectionId[] = ["photos", "gift"];

/** 2027-03-14 14:00 KST (예식 1시간 후) */
const AFTER_MS = Date.parse("2027-03-14T14:00:00+09:00");

export function getDayMode(now: Date): DayMode {
  const kstDate = new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  if (kstDate !== "2027-03-14") return "normal";
  return now.getTime() >= AFTER_MS ? "after" : "day";
}

export function orderSections(mode: DayMode): SectionId[] {
  const first = mode === "day" ? DAY_FIRST : mode === "after" ? AFTER_FIRST : [];
  return [...first, ...NORMAL.filter((id) => !first.includes(id))];
}
