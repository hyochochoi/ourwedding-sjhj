import { describe, expect, it } from "vitest";
import { getDayMode, orderSections } from "./day-mode";

describe("wedding day mode", () => {
  it("uses the requested invitation order in normal mode", () => {
    expect(orderSections("normal")).toEqual([
      "invitation",
      "date",
      "location",
      "info",
      "gallery",
      "gift",
      "stars",
      "photos",
      "thankyou",
    ]);
  });
  it("is normal before the wedding day", () => {
    expect(getDayMode(new Date("2027-03-13T23:00:00+09:00"))).toBe("normal");
  });
  it("is day mode on 3/14 before 14:00 KST", () => {
    expect(getDayMode(new Date("2027-03-14T13:59:00+09:00"))).toBe("day");
  });
  it("is after mode from 14:00 KST", () => {
    expect(getDayMode(new Date("2027-03-14T14:00:00+09:00"))).toBe("after");
  });
  it("day mode puts date, location, stars, photos first", () => {
    expect(orderSections("day").slice(0, 4)).toEqual(["date", "location", "stars", "photos"]);
  });
  it("after mode puts photos then gift first", () => {
    expect(orderSections("after").slice(0, 2)).toEqual(["photos", "gift"]);
  });
});
