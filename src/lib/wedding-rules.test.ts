import { describe, expect, it } from "vitest";
import { MAX_PHOTO_FILES, rsvpSchema, rsvpSummary, resetConfirmation } from "./wedding-rules";
describe("wedding rules", () => {
 it("allows 100000 photo selections", () => expect(MAX_PHOTO_FILES).toBe(100000));
 it("requires a name, attendance and people count", () => { expect(rsvpSchema.safeParse({ name: "", side: "신부", attendance: "참석", guest_count: 1 }).success).toBe(false); expect(rsvpSchema.safeParse({name:"효정",side:"신부",attendance:"참석",guest_count:2}).success).toBe(true); });
 it("separates attendance and people", () => expect(rsvpSummary([{attendance:"참석",guest_count:3},{attendance:"불참",guest_count:0}])).toEqual({yes:1,no:1,people:3}));
 it("requires exact reset confirmation", () => { expect(resetConfirmation.safeParse("초기화").success).toBe(true); expect(resetConfirmation.safeParse("").success).toBe(false); });
});
