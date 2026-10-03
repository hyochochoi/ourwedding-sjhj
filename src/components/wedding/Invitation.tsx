import { Clover, Heart } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { WEDDING } from "@/lib/wedding-data";
import heroImage from "@/assets/hero.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";

/** 손편지 스캔 이미지를 받으면 이 값을 교체하세요. */
const HANDWRITTEN_LETTER_URL = "";

function FilmStrip({ photos, tilt }: { photos: string[]; tilt: string }) {
  return (
    <div className={`relative w-[22%] shrink-0 rounded-sm bg-film px-[14%] py-3 shadow-lg ${tilt}`}>
      <span className="film-holes absolute inset-y-2 left-[3%] w-[8%]" />
      <span className="film-holes absolute inset-y-2 right-[3%] w-[8%]" />
      <div className="space-y-2">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="연애 시절 사진"
            loading="lazy"
            draggable={false}
            className="no-zoom aspect-[3/4] w-full rounded-[2px] object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function Tape({ className }: { className: string }) {
  return <span className={`absolute z-20 h-5 w-16 ${className}`} aria-hidden />;
}

export function Invitation() {
  return (
    <Section eyebrow="Invitation" title="초대합니다">
      <div className="relative flex items-start justify-between gap-2">
        <FilmStrip photos={[g1, g2, heroImage]} tilt="-rotate-2" />

        <div className="relative min-w-0 flex-1 pt-4">
          <Tape className="-top-1 left-1/2 -translate-x-1/2 -rotate-3 bg-tape-lime" />
          <Tape className="-bottom-2 -left-3 rotate-[25deg] bg-tape-green" />
          <div className="relative rounded-md bg-cream p-3 text-paper-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
            {HANDWRITTEN_LETTER_URL ? (
              <img
                src={HANDWRITTEN_LETTER_URL}
                alt="신랑신부가 직접 쓴 손편지"
                loading="lazy"
                draggable={false}
                className="no-zoom w-full"
              />
            ) : (
              <p className="serif-title px-1 py-5 text-center text-[0.8rem] leading-[2.1]">
                오랜 시간 걸음 지키며
                <br />
                서로의 하루가 되어주었습니다.
                <br />
                <br />
                이제 부부라는 이름으로
                <br />
                같은 방향을 걸어가려 합니다.
                <br />
                <br />이 뜻깊은 시작의 자리에
                <br />
                소중한 분들을 정중히 초대합니다.
                <br />
                <br />
                {WEDDING.groom.name} · {WEDDING.bride.name} 드림
              </p>
            )}
          </div>

          {/* 빈티지 도장 */}
          <div className="absolute -right-2 -bottom-6 z-20 flex size-16 rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-envelope bg-cream/90 text-envelope">
            <span className="text-[0.5rem] tracking-widest">WEDDING</span>
            <span className="font-display text-xs">03.14</span>
            <span className="text-[0.5rem]">2027</span>
          </div>
          <Clover className="absolute -top-3 -left-2 z-20 size-7 -rotate-12 fill-primary text-envelope-shade" />
          <Heart className="absolute top-1/3 -right-3 z-20 size-5 rotate-12 fill-primary text-primary" />
        </div>

        <FilmStrip photos={[g3, g1, g2]} tilt="rotate-2" />
      </div>

      <div className="mt-12 space-y-1 text-center text-sm text-foreground/90">
        <p>
          {WEDDING.groom.father} · {WEDDING.groom.mother}
          <span className="mx-2 text-muted-foreground">의 장남</span>
          <span className="text-primary">{WEDDING.groom.name}</span>
        </p>
        <p>
          {WEDDING.bride.father} · {WEDDING.bride.mother}
          <span className="mx-2 text-muted-foreground">의 장녀</span>
          <span className="text-primary">{WEDDING.bride.name}</span>
        </p>
      </div>
    </Section>
  );
}
