import { Section } from "@/components/wedding/Section";
import { WEDDING } from "@/lib/wedding-data";

const HANDWRITTEN_LINES = [
  "함께 있을 때 가장 나 다운 사람이 되게 하고,",
  "함께 있을 때 미래를 꿈꾸게 하는 사람을 만나",
  "올 봄, 결혼을 합니다.",
  "부부라는 이름으로 시작하는 뜻 깊은 순간을",
  "소중한 걸음으로 축복해주시면 감사하겠습니다.",
];

function Tape({ className }: { className: string }) {
  return <span className={`absolute z-20 h-5 w-16 ${className}`} aria-hidden />;
}

export function Invitation() {
  return (
    <Section eyebrow="Invitation" title="초대합니다">
      <div className="relative mx-auto my-10 max-w-[320px] px-1">
        <Tape className="-top-2 left-1/2 -translate-x-1/2 -rotate-3 bg-tape-blush" />
        <div className="invitation-letter relative flex min-h-[360px] items-center justify-center rounded-md px-5 py-10 text-paper-foreground">
          <div className="flex w-full flex-col items-center">
            {HANDWRITTEN_LINES.map((line, index) => (
              <img
                key={line}
                src={`/handwritten-invitation/line-${String(index + 1).padStart(2, "0")}.png`}
                alt={line}
                width={570}
                height={55}
                loading="lazy"
                draggable={false}
                className={`no-zoom w-full ${index === 0 ? "" : index === 3 ? "mt-7" : "mt-2"}`}
              />
            ))}
          </div>
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
