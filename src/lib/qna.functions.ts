import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const answerSchema = z.object({
  id: z.string().uuid(),
  answer: z.string().trim().min(1).max(1000),
  code: z.string().min(1),
});

export const answerQuestion = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => answerSchema.parse(data))
  .handler(async ({ data }) => {
    const adminCode = process.env["ADMIN_CODE"];
    if (!adminCode) throw new Error("관리자 코드가 설정되지 않았습니다.");
    if (data.code !== adminCode) throw new Error("관리자 코드가 올바르지 않습니다.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("qna_questions")
      .update({ answer: data.answer, answered_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
