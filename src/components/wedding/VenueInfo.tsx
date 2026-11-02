import { cn } from "@/lib/utils";
import { useState } from "react";
import { Section } from "@/components/wedding/Section";

const CARDS = [
  { title: "식사", body: "예식 후 같은 층 연회장에서 뷔페로 준비됩니다. 예식 종료 후 약 2시간 동안 운영됩니다." },
  { title: "포토부스", body: "9층 홀 입구에 포토부스를 준비했어요. 즉석 인화 사진과 함께 오늘의 추억을 남겨주세요." },
  { title: "ATM", body: "건물 1층 로비와 지하 1층 편의점 옆에 ATM이 있습니다." },
];

export function VenueInfo() {
  const [active, setActive] = useState(0);
  return (
    <Section eyebrow="Information" title="안내 사항">
      <div className="flex border-b border-border">
        {CARDS.map((c, i) => (
          <button
            key={c.title}
            type="button"
            onClick={() => setActive(i)}
            className={cn("-mb-px flex-1 border-b-2 py-3 text-sm transition-colors", active === i ? "border-primary font-medium text-primary" : "border-transparent text-muted-foreground")}
          >
            {c.title}
          </button>
        ))}
      </div>
      <p key={active} className="tab-fade mt-6 min-h-16 px-2 text-center text-sm leading-relaxed break-keep">{CARDS[active]?.body}</p>
    </Section>
  );
}
