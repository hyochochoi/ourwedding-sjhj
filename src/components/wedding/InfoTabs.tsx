import { useState } from "react";
import { Banknote, Camera, ParkingCircle, Utensils } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Location } from "@/components/wedding/Location";
import { Accounts } from "@/components/wedding/Accounts";
import { GuestPhotosButton } from "@/components/wedding/GuestPhotos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "way", label: "오시는 길 & 주차" },
  { id: "meal", label: "식사 & 포토부스" },
  { id: "gift", label: "마음 전하실 곳" },
] as const;

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ParkingCircle;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl bg-cream p-4 text-paper-foreground shadow-[0_14px_30px_-22px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2">
        <Icon className="size-4 opacity-70" />
        <h3 className="serif-title text-sm">{title}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed opacity-80">{children}</p>
    </article>
  );
}

function AskForm() {
  const [author, setAuthor] = useState("");
  const [question, setQuestion] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim() || !question.trim()) return void toast.error("이름과 내용을 입력해 주세요.");
    setSaving(true);
    const { error } = await supabase
      .from("qna_questions")
      .insert({ author: author.trim(), question: question.trim() });
    setSaving(false);
    if (error) return void toast.error("전달에 실패했어요.");
    setQuestion("");
    toast.success("문의가 전달되었어요. 확인 후 연락드릴게요 🌿");
  }

  return (
    <form onSubmit={submit} className="soft-card mt-6 space-y-2 p-4">
      <p className="serif-title text-center text-sm">궁금한 점이 있으신가요?</p>
      <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름" maxLength={20} />
      <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={2} maxLength={500} placeholder="남겨주시면 신랑·신부가 직접 답변드려요" />
      <Button type="submit" size="sm" disabled={saving} className="w-full rounded-full">
        문의 남기기
      </Button>
    </form>
  );
}

export function InfoTabs() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("way");

  return (
    <Section eyebrow="Information" title="안내 사항">
      <div className="grid grid-cols-3 gap-1 rounded-full bg-secondary/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-1 py-2 text-[0.72rem] leading-tight transition-colors",
              tab === t.id ? "bg-primary font-medium text-primary-foreground" : "text-foreground/80",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="tab-fade mt-5">
        {tab === "way" && (
          <div className="space-y-3">
            <Location />
            <InfoCard icon={ParkingCircle} title="주차 안내">
              웨스턴타워 3차 B동 지하주차장(지하 1~4층)을 이용해 주세요. 예식 하객은 2시간 무료이며 9층
              안내데스크에서 주차 등록을 도와드립니다.
            </InfoCard>
          </div>
        )}

        {tab === "meal" && (
          <div className="space-y-3">
            <InfoCard icon={Utensils} title="식사 안내">
              예식 후 같은 층 연회장에서 뷔페로 준비됩니다. 예식 종료 후 약 2시간 동안 운영됩니다.
            </InfoCard>
            <InfoCard icon={Camera} title="포토부스">
              9층 홀 입구에 포토부스를 준비했어요. 즉석 인화 사진과 함께 오늘의 추억을 남겨주세요.
            </InfoCard>
            <InfoCard icon={Banknote} title="ATM">
              건물 1층 로비와 지하 1층 편의점 옆에 ATM이 있습니다.
            </InfoCard>
            <div className="pt-4 pb-2 text-center">
              <GuestPhotosButton />
              <p className="mt-3 text-[0.7rem] text-muted-foreground">
                찍어주신 사진을 한 번에 1,000장까지 보내주실 수 있어요
              </p>
            </div>
          </div>
        )}

        {tab === "gift" && <Accounts />}
      </div>

      <AskForm />
    </Section>
  );
}
