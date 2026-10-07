import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PHOTO_CATEGORIES } from "@/lib/photo-categories";

const VIDEO = /\.(mp4|mov|m4v|webm|avi|mkv|3gp|hevc)$/i;

/** 업로드된 하객 사진 1장을 AI로 분류해 저장합니다. 이미 분류된 파일은 건너뜁니다. */
export const classifyGuestPhoto = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ path: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const existing = await db.from("guest_photo_tags").select("category").eq("name", data.path).maybeSingle();
    if (existing.data) return { category: existing.data.category };

    const { data: signed, error } = await db.storage.from("guest-photos").createSignedUrl(data.path, 300);
    if (error || !signed) throw new Error("파일을 찾을 수 없어요.");

    let category = "기타";
    if (!VIDEO.test(data.path)) {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          reasoning_effort: "low",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `결혼식 하객이 찍은 사진입니다. 다음 중 하나로만 답하세요: ${PHOTO_CATEGORIES.join(", ")}.
신랑=신랑 혼자, 신부=신부 혼자, 신랑신부=두 사람이 함께, 혼주=양가 부모님 중심, 하객=하객 개인이나 소수, 단체=여러 명의 단체 사진, 웨딩홀=식장·장식·풍경, 기타=그 외. 카테고리 단어 하나만 출력하세요.`,
                },
                { type: "image_url", image_url: { url: signed.signedUrl } },
              ],
            },
          ],
        }),
      });
      if (res.ok) {
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const answer = json.choices?.[0]?.message?.content?.replace(/\s/g, "") ?? "";
        category =
          [...PHOTO_CATEGORIES].sort((a, b) => b.length - a.length).find((c) => answer.includes(c)) ?? "기타";
      } else if (res.status === 429 || res.status === 402) {
        throw new Error("AI 분류가 잠시 어려워요. 나중에 다시 시도해 주세요.");
      }
    }
    await db.from("guest_photo_tags").upsert({ name: data.path, category });
    return { category };
  });
