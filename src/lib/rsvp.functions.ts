import { createServerFn } from "@tanstack/react-start";
import { rsvpSchema } from "./wedding-rules";
export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("rsvp_submissions").insert({ ...data, guest_count: data.attendance === "참석" ? data.guest_count : 0, phone: data.reminder_consent ? (data.phone ?? null) : null });
    if (error) throw new Error("전달에 실패했어요. 잠시 후 다시 시도해 주세요.");
    return { ok: true };
  });
