import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { inviteSlugSchema, resetConfirmation } from "./wedding-rules";

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
        .select("id, author, content, star_type, pos_x, pos_y, color_index, created_at")
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
    const { data: tags, error: tagError } = await db.from("guest_photo_tags").select("name, category").in("name", names);
    if (tagError) throw new Error("분류 정보를 불러오지 못했어요.");
    return {
      photos: names.map((name, i) => ({
        name,
        category: tags?.find(t => t.name === name)?.category ?? "미분류",
        downloadUrl: signed?.[i]?.signedUrl ?? "",
        previewUrl: previews?.[i]?.signedUrl ?? "",
      })),
      hasMore: names.length === 200,
    };
  });

export const createInvitee = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ code: z.string().min(1), name: z.string().trim().min(1).max(30), slug: inviteSlugSchema }).parse(d),
  )
  .handler(async ({ data }) => {
    checkCode(data.code);
    const db = await admin();
    const slug = data.slug;
    const { error } = await db.from("invitees").insert({ code: slug, name: data.name });
    if (error) throw new Error(error.code === "23505" ? "이미 사용 중인 영문 이름입니다." : "링크를 만들지 못했어요.");
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

export const resetRsvps = createServerFn({ method: "POST" })
 .inputValidator((d: unknown) => z.object({ code: z.string().min(1), confirmation: resetConfirmation }).parse(d))
 .handler(async ({ data }) => {
  checkCode(data.code); const db = await admin();
  const { error } = await db.from("rsvp_submissions").delete().not("id", "is", null);
  if (error) throw new Error("응답 초기화에 실패했어요.");
  return { ok: true };
 });
export const resetGuestPhotos = createServerFn({ method: "POST" })
 .inputValidator((d: unknown) => z.object({ code: z.string().min(1), confirmation: resetConfirmation }).parse(d))
 .handler(async ({ data }) => {
  checkCode(data.code); const db = await admin();
  // Delete one bounded page per call; callers continue until complete.
  const { data: files, error } = await db.storage.from("guest-photos").list("", { limit: 200 });
  if (error) throw new Error("사진 목록을 불러오지 못했어요.");
  const names = (files ?? []).filter(f => f.id).map(f => f.name);
  if (names.length) {
   const removed = await db.storage.from("guest-photos").remove(names);
   if (removed.error) throw new Error("일부 사진을 삭제하지 못했어요. 다시 시도해 주세요.");
   const tags = await db.from("guest_photo_tags").delete().in("name", names);
   if (tags.error) throw new Error("분류 정보를 삭제하지 못했어요.");
  }
  return { removed: names.length, hasMore: names.length === 200 };
 });
