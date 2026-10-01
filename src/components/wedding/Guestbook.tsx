import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  author: string;
  content: string;
  color_index: number;
  created_at: string;
};

const NOTE_BG = [
  "bg-note-1",
  "bg-note-2",
  "bg-note-3",
  "bg-note-4",
  "bg-note-5",
  "bg-note-6",
];
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data } = await supabase
        .from("guestbook_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (active && data) setMessages(data as Message[]);
    }
    void load();

    const channel = supabase
      .channel("guestbook")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook_messages" },
        (payload) =>
          setMessages((prev) => [payload.new as Message, ...prev].slice(0, 100)),
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim() || !content.trim()) {
      toast.error("이름과 메시지를 모두 입력해 주세요.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("guestbook_messages").insert({
      author: author.trim(),
      content: content.trim(),
      color_index: Math.floor(Math.random() * 6),
    });
    setSaving(false);

    if (error) {
      toast.error("등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setContent("");
    toast.success("축하 메시지가 등록되었습니다");
  }

  return (
    <Section eyebrow="Guestbook" title="축하 메시지">
      <form onSubmit={submit} className="soft-card space-y-3 p-4">
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          maxLength={20}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 축하의 말씀을 남겨주세요"
          rows={3}
          maxLength={300}
        />
        <Button type="submit" disabled={saving} className="w-full rounded-full">
          {saving ? "등록 중..." : "메시지 남기기"}
        </Button>
      </form>

      {messages.length > 0 && (
        <div className="mt-5 columns-2 gap-3 [column-fill:_balance]">
          {messages.map((message, index) => (
            <article
              key={message.id}
              className={`${NOTE_BG[message.color_index % 6]} ${TILT[index % 4]} mb-3 inline-block w-full break-inside-avoid rounded-xl p-4 text-paper-foreground shadow-[0_10px_22px_-16px_rgba(0,0,0,0.9)]`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className="serif-title mt-3 text-right text-[0.7rem] opacity-70">
                — {message.author}
              </p>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}
