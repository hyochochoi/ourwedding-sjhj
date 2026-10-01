import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { answerQuestion } from "@/lib/qna.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "문의 답변 관리 | 이상진 · 최효정 결혼식" },
      {
        name: "description",
        content: "하객 문의와 참석 여부를 확인하고 답변하는 관리 페이지입니다.",
      },
      { property: "og:title", content: "문의 답변 관리" },
      {
        property: "og:description",
        content: "하객 문의와 참석 여부를 확인하고 답변하는 관리 페이지입니다.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Question = {
  id: string;
  author: string;
  question: string;
  answer: string | null;
  created_at: string;
};

function AdminPage() {
  const [code, setCode] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const sendAnswer = useServerFn(answerQuestion);

  async function load() {
    const { data } = await supabase
      .from("qna_questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setQuestions(data as Question[]);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(id: string) {
    const answer = (drafts[id] ?? "").trim();
    if (!code.trim()) {
      toast.error("관리자 코드를 입력해 주세요.");
      return;
    }
    if (!answer) {
      toast.error("답변 내용을 입력해 주세요.");
      return;
    }
    setBusy(id);
    try {
      await sendAnswer({ data: { id, answer, code: code.trim() } });
      toast.success("답변이 등록되었습니다");
      setDrafts((prev) => ({ ...prev, [id]: "" }));
      await load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "답변 등록에 실패했습니다.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[560px] px-5 py-10">
      <h1 className="serif-title text-lg">문의 답변 관리</h1>
      <p className="mt-1 text-xs text-muted-foreground">
        관리자 코드를 입력한 뒤 각 문의에 답변을 남겨주세요.
      </p>

      <Input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="관리자 코드"
        className="mt-4"
      />

      <div className="mt-6 space-y-4">
        {questions.length === 0 && (
          <p className="text-xs text-muted-foreground">
            아직 등록된 문의가 없습니다.
          </p>
        )}
        {questions.map((item) => (
          <article key={item.id} className="soft-card space-y-3 p-4">
            <div>
              <p className="text-[0.7rem] text-muted-foreground">
                {item.author} ·{" "}
                {new Date(item.created_at).toLocaleString("ko-KR")}
              </p>
              <p className="mt-1 text-sm whitespace-pre-wrap">
                {item.question}
              </p>
            </div>
            {item.answer && (
              <p className="rounded-xl bg-primary/15 p-3 text-xs whitespace-pre-wrap">
                A. {item.answer}
              </p>
            )}
            <Textarea
              rows={3}
              value={drafts[item.id] ?? ""}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
              }
              placeholder={item.answer ? "답변 수정하기" : "답변 작성하기"}
            />
            <Button
              size="sm"
              className="rounded-full"
              disabled={busy === item.id}
              onClick={() => submit(item.id)}
            >
              {busy === item.id ? "등록 중..." : "답변 등록"}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
