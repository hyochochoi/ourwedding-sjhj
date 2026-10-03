import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function checkCode(code: string) {
  const adminCode = process.env["ADMIN_CODE"];
  if (!adminCode) throw new Error("관리자 코드가 아직 설정되지 않았습니다.");
  if (code !== adminCode) throw new Error("관리자 코드가 올바르지 않습니다.");
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ code: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const [rsvps, guestbook, invitees] = await Promise.all([
      db.from("rsvp_submissions").select("*").order("created_at", { ascending: false }),
      db
        .from("guestbook_messages")
        .select("id, author, star_type, pos_x, pos_y, color_index, created_at")
        .order("created_at", { ascending: false }),
      db.from("invitees").select("*").order("created_at", { ascending: false }),
    ]);
    if (rsvps.error) throw new Error(rsvps.error.message);
    if (guestbook.error) throw new Error(guestbook.error.message);
    if (invitees.error) throw new Error(invitees.error.message);
    return {
      rsvps: rsvps.data,
      guestbook: guestbook.data,
      invitees: invitees.data,
    };
  });

export const getGuestPhotos = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().min(1), offset: z.number().int().min(0) }).parse(d),
  )
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const { data: files, error } = await db.storage
      .from("guest-photos")
      .list("", { limit: 200, offset: data.offset, sortBy: { column: "created_at", order: "desc" } });
    if (error) throw new Error(error.message);
    const names = (files ?? []).filter((f) => f.id).map((f) => f.name);
    if (names.length === 0) return { photos: [], hasMore: false };
    const { data: signed, error: signError } = await db.storage
      .from("guest-photos")
      .createSignedUrls(names, 60 * 60, { download: true });
    if (signError) throw new Error(signError.message);
    const { data: previews } = await db.storage
      .from("guest-photos")
      .createSignedUrls(names, 60 * 60);
    return {
      photos: names.map((name, i) => ({
        name,
        downloadUrl: signed?.[i]?.signedUrl ?? "",
        previewUrl: previews?.[i]?.signedUrl ?? "",
      })),
      hasMore: names.length === 200,
    };
  });

export const createInvitee = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().min(1), name: z.string().trim().min(1).max(30) }).parse(d),
  )
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    const bytes = crypto.getRandomValues(new Uint8Array(7));
    const slug = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
    const { error } = await db.from("invitees").insert({ code: slug, name: data.name });
    if (error) throw new Error(error.message);
    return { code: slug };
  });

export const deleteInvitee = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().min(1), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const { error } = await db.from("invitees").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
