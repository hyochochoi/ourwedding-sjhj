import { Banknote, Camera, Utensils } from "lucide-react";
import { Section } from "@/components/wedding/Section";

const CARDS = [
  { Icon: Utensils, title: "식사 안내", body: "예식 후 같은 층 연회장에서 뷔페로 준비됩니다. 예식 종료 후 약 2시간 동안 운영됩니다." },
  { Icon: Camera, title: "포토부스", body: "9층 홀 입구에 포토부스를 준비했어요. 즉석 인화 사진과 함께 오늘의 추억을 남겨주세요." },
  { Icon: Banknote, title: "ATM", body: "건물 1층 로비와 지하 1층 편의점 옆에 ATM이 있습니다." },
];

export function VenueInfo() {
  return (
    <Section eyebrow="Information" title="안내 사항">
      <div className="space-y-3">
        {CARDS.map(({ Icon, title, body }) => (
          <article key={title} className="rounded-2xl bg-cream p-4 text-paper-foreground shadow-[0_14px_30px_-22px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2">
              <Icon className="size-4 opacity-70" />
              <h3 className="serif-title text-sm">{title}</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed opacity-80">{body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
