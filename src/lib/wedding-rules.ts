import { z } from "zod";
export const MAX_PHOTO_FILES = 100000;
export const MAX_PHOTO_SIZE = 50 * 1024 * 1024;
export const rsvpSchema = z.object({
  name: z.string().trim().min(1, "성함을 입력해 주세요.").max(20),
  side: z.enum(["신랑", "신부"]),
  attendance: z.enum(["참석", "불참"]),
  guest_count: z.number().int().min(1).max(100),
  reminder_consent: z.boolean(),
  phone: z.string().trim().max(20).optional(),
}).refine(d => !d.reminder_consent || /^[0-9-]{9,13}$/.test(d.phone ?? ""), { message: "연락받으실 전화번호를 입력해 주세요.", path: ["phone"] });
export const inviteSlugSchema = z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).min(1).max(40);
export const resetConfirmation = z.literal("초기화");
export function rsvpSummary(rows: { attendance: string; guest_count: number }[]) {
  const yes = rows.filter(r => r.attendance === "참석");
  return { yes: yes.length, no: rows.filter(r => r.attendance === "불참").length, people: yes.reduce((sum, r) => sum + r.guest_count, 0) };
}
