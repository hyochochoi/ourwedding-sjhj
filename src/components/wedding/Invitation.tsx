import { Star } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { WEDDING } from "@/lib/wedding-data";

/** 손편지 스캔 이미지를 받으면 이 값을 교체하세요. */
const HANDWRITTEN_LETTER_URL = "";

export function Invitation() {
  return (
    <Section eyebrow="Invitation" title="초대합니다">
      <div className="space-y-8 text-center">
        <div className="flex justify-center gap-2 text-primary">
          <Star className="size-3 fill-primary" />
          <Star className="size-4 fill-primary" />
          <Star className="size-3 fill-primary" />
        </div>

        {HANDWRITTEN_LETTER_URL ? (
          <figure className="relative mx-auto max-w-[340px]">
            <div className="absolute -inset-3 rounded-[2rem] border border-primary/25" />
            <div className="relative rounded-[1.5rem] bg-paper p-3 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
              <img
                src={HANDWRITTEN_LETTER_URL}
                alt="신랑신부가 직접 쓴 손편지"
                loading="lazy"
                className="no-zoom w-full rounded-[1.1rem]"
              />
            </div>
            <figcaption className="mt-4 text-xs text-muted-foreground">
              {WEDDING.groom.name} · {WEDDING.bride.name} 드림
            </figcaption>
          </figure>
        ) : (
          <div className="relative mx-auto max-w-[340px]">
            <div className="absolute -inset-3 rounded-[2rem] border border-primary/25" />
            <div className="relative rounded-[1.5rem] bg-paper px-6 py-10 text-paper-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
              <p className="serif-title text-[0.95rem] leading-[2.2]">
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
              </p>
              <p className="serif-title mt-8 text-sm">
                {WEDDING.groom.name} · {WEDDING.bride.name} 드림
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1 text-sm text-foreground/90">
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
      </div>
    </Section>
  );
}
