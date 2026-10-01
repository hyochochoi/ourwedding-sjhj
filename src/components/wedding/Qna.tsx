import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { FAQS } from "@/lib/wedding-data";

type Question = {
  id: string;
  author: string;
  question: string;
  answer: string | null;
  created_at: string;
};

export function Qna() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("qna_questions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (active && data) setQuestions(data as Question[]);
    }
    void load();

    const channel = supabase
      .channel("qna")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "qna_questions" },
        () => void load(),
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim() || !question.trim()) {
      toast.error("이름과 문의 내용을 입력해 주세요.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("qna_questions").insert({
      author: author.trim(),
      question: question.trim(),
    });
    setSaving(false);

    if (error) {
      toast.error("등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setQuestion("");
    toast.success("문의가 접수되었습니다. 확인 후 답변드릴게요.");
  }

  return (
    <Section eyebrow="FAQ" title="자주 묻는 질문">
      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.q}
            value={faq.q}
            className="soft-card overflow-hidden border-b-0 px-4"
          >
            <AccordionTrigger className="text-left text-sm hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="serif-title mt-8 mb-3 text-center text-sm">
        궁금한 점 남기기
      </h3>
      <form onSubmit={submit} className="soft-card space-y-3 p-4">
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          maxLength={20}
        />
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="궁금하신 내용을 남겨주시면 직접 답변드립니다"
          rows={3}
          maxLength={500}
        />
        <Button type="submit" disabled={saving} className="w-full rounded-full">
          {saving ? "등록 중..." : "문의 남기기"}
        </Button>
      </form>

      {questions.length > 0 && (
        <div className="mt-5 space-y-3">
          {questions.map((item) => (
            <article key={item.id} className="soft-card p-4">
              <p className="text-[0.7rem] text-muted-foreground">
                {item.author}
              </p>
              <p className="mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                Q. {item.question}
              </p>
              {item.answer ? (
                <p className="mt-3 rounded-xl bg-primary/15 p-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground">
                  A. {item.answer}
                </p>
              ) : (
                <p className="mt-3 text-[0.7rem] text-muted-foreground">
                  답변 준비 중입니다
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
