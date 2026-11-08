import { Section } from "@/components/wedding/Section";
import { HANDWRITTEN_LETTER_URL, WEDDING } from "@/lib/wedding-data";

function Tape({ className }: { className: string }) {
  return <span className={`absolute z-20 h-5 w-16 ${className}`} aria-hidden />;
}

export function Invitation() {
  return (
    <Section eyebrow="Invitation" title="초대합니다">
      <div className="relative mx-auto my-10 max-w-[320px] px-1">
        <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3 bg-tape-blush" />
        <div className="invitation-letter relative flex min-h-[360px] items-center justify-center rounded-md bg-cream px-5 py-10 text-paper-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
          {HANDWRITTEN_LETTER_URL ? (
            <img
              src={HANDWRITTEN_LETTER_URL}
              alt="신랑신부가 직접 쓴 손편지"
              loading="lazy"
              draggable={false}
              className="no-zoom w-full"
            />
          ) : (
            <p className="serif-title py-4 text-center text-[0.88rem] leading-[1.8] break-keep">
              함께 있을 때 가장 나 다운 모습이 되게 하고,
              <br />
              함께 있을 때 미래를 꿈꾸게 하는 사람을 만나
              <br />
              올 봄 결혼 합니다.
              <br />
              <br />
              부부라는 이름으로 시작하는 뜻깊은 순간을
              <br />
              소중한 걸음으로 축복해주시면 감사하겠습니다
            </p>
          )}
        </div>
      </div>

      <div className="mx-[-0.5rem] mt-10 space-y-1 text-center text-[0.95rem] text-foreground/80">
        <p className="whitespace-nowrap">
          {WEDDING.groom.father} · {WEDDING.groom.mother}
          <span className="text-xs">의 장남</span>{" "}
          <strong className="font-bold">{WEDDING.groom.name.slice(1)}</strong>
        </p>
        <p className="whitespace-nowrap">
          {WEDDING.bride.father} · {WEDDING.bride.mother}
          <span className="text-xs">의 장녀</span>{" "}
          <strong className="font-bold">{WEDDING.bride.name.slice(1)}</strong>
        </p>
      </div>
    </Section>
  );
}
