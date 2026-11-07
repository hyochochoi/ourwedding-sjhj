import { useRef, useState, type TouchEvent } from "react";
import { Section } from "@/components/wedding/Section";

const CARDS = [
  { title: "식사", lines: ["뷔페 · 9층 웨딩홀 옆 연회장 이용"] },
  { title: "주차", lines: ["하객 주차 2시간 무료", "홀 내부 주차 정산기 등록 필요"] },
  { title: "ATM", lines: ["1층 · 기업은행 ATM", "9층 · 하나은행 ATM"] },
  {
    title: "포토부스",
    lines: ["홀 입구에 포토부스 위치", "즉석 인화 사진과 함께 오늘의 추억을 남겨주세요."],
  },
];

export function VenueInfo() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      setActive((index) => (index + (delta < 0 ? 1 : -1) + CARDS.length) % CARDS.length);
    }
    touchStartX.current = null;
  }

  return (
    <Section eyebrow="Information" title="안내 사항">
      <div className="notice-carousel mx-auto max-w-[380px] px-1">
        <div
          className="notice-carousel__viewport"
          role="region"
          aria-label="예식 안내"
          aria-roledescription="carousel"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0].clientX;
          }}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStartX.current = null;
          }}
        >
          <div
            className="notice-carousel__track"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {CARDS.map((card, i) => (
              <article
                key={card.title}
                className="notice-card relative min-h-40 px-5 pb-5 pt-4"
                aria-hidden={active !== i}
                aria-label={`${i + 1} / ${CARDS.length}: ${card.title}`}
              >
                <header className="flex items-center justify-between border-b border-paper-foreground/15 pb-3 text-[0.62rem] tracking-[0.16em] text-paper-foreground/60">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                    NOTICE
                  </span>
                  <span>
                    {String(i + 1).padStart(2, "0")} / {String(CARDS.length).padStart(2, "0")}
                  </span>
                </header>
                <div className="pt-6">
                  <h3 className="serif-title text-base font-bold text-paper-foreground">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-[0.78rem] leading-relaxed text-paper-foreground/80">
                    {card.lines.map((line) => (
                      <li key={line} className="break-keep">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2" aria-label="안내 카드 선택">
          {CARDS.map((card, i) => (
            <button
              key={card.title}
              type="button"
              onClick={() => setActive(i)}
              className={`size-2 rounded-full transition-colors ${active === i ? "bg-primary" : "bg-foreground/30"}`}
              aria-label={`${i + 1}번째 안내: ${card.title}`}
              aria-current={active === i ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
