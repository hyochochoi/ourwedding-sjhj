import { Section } from "@/components/wedding/Section";
import { HANDWRITTEN_LETTER_URL, WEDDING } from "@/lib/wedding-data";
import { WEDDING_PHOTOS } from "@/lib/wedding-photos";
const TOP = WEDDING_PHOTOS.slice(0, 5).map(p => p.src);
const BOTTOM = WEDDING_PHOTOS.slice(4).map(p => p.src);

/** 실제 35mm 필름처럼: 위아래 구멍 줄 + 프레임 + 프레임 번호. 한 화면에 약 5컷. */
function FilmStrip({ photos, reverse, tilt }: { photos: string[]; reverse?: boolean; tilt: string }) {
  const frames = [...photos, ...photos];
  return (
    <div className={`-mx-6 overflow-hidden bg-film py-1.5 shadow-lg ${tilt}`} aria-hidden>
      <div className={`flex w-max ${reverse ? "film-roll-reverse" : "film-roll"}`}>
        {frames.map((src, i) => (
          <div key={i} className="w-[calc(480px/5)] max-w-[20vw] shrink-0 px-[3px]">
            <div className="film-sprockets h-2" />
            <div className="my-1 border border-film bg-film p-[2px]">
              <img src={src} alt="" draggable={false} className="no-zoom aspect-[3/2] w-full object-cover sepia-[0.15]" />
            </div>
            <div className="film-sprockets h-2" />
          </div>
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
      <FilmStrip photos={TOP} tilt="-rotate-1" />

      <div className="relative mx-auto my-10 max-w-[320px] px-1">
        <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3 bg-tape-lime" />
        <div className="relative rounded-md bg-cream p-4 text-paper-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
          {HANDWRITTEN_LETTER_URL ? (
            <img
              src={HANDWRITTEN_LETTER_URL}
              alt="신랑신부가 직접 쓴 손편지"
              loading="lazy"
              draggable={false}
              className="no-zoom w-full"
            />
          ) : (
            <p className="serif-title py-5 text-center text-[0.8rem] leading-[2] break-keep">
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
      </div>

      <FilmStrip photos={BOTTOM} reverse tilt="rotate-1" />

      <div className="mt-10 space-y-1 text-center text-sm text-foreground/90">
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
