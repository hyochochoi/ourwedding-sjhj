import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "rising" | "open";

const WAX_PALETTES = {
  pearl: { light: "#FFFFFF", mid: "#F4F1EA", dark: "#D6D0C4", edge: "#B8B1A5", ink: "#A59E8E" },
  burgundy: { light: "#B8404E", mid: "#8C1D2C", dark: "#5E0F1C", edge: "#45090F", ink: "#45090F" },
  rose: { light: "#DDA5AA", mid: "#B8737C", dark: "#8A4D56", edge: "#6B3841", ink: "#6B3841" },
  ice: { light: "#B4CCDA", mid: "#7F9EB3", dark: "#566F82", edge: "#415667", ink: "#415667" },
} as const;

const WAX = WAX_PALETTES.pearl;

export function Envelope({ guestName, onClose }: { guestName: string; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [showRsvp, setShowRsvp] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    timer.current = setTimeout(() => {
      setPhase("rising");
      timer.current = setTimeout(() => setPhase("open"), 1300);
    }, 500);
  }

  const lifted = phase === "rising" || phase === "open";

  return (
    <div className="cover-paper fixed inset-0 z-50 overflow-y-auto bg-background px-6 text-foreground">
      <div className="mx-auto flex min-h-full max-w-[320px] flex-col items-center justify-center py-10">
        <div className={cn("envelope-welcome", phase !== "closed" && "envelope-welcome-hidden")}>
          <h1 className="flex flex-col font-cover text-[clamp(1.8rem,8vw,4.0rem)] leading-[0.8] text-primary">
            <span>Wedding</span>
            <span>Invitation</span>
          </h1>
          <p className="mt-4 text-center text-base font-medium leading-relaxed text-foreground/90">
            {guestName === "소중한 분" ? "소중한 날, 당신을 초대합니다." : `To.${guestName}`}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={open}
          aria-label="봉투 열기"
          className={cn(
            "envelope-stage relative block h-[210px] w-full shrink-0 rounded-none p-0 hover:bg-transparent",
            phase === "closed" && "envelope-idle",
            phase === "closed" ? "mt-10" : "mt-8",
          )}
        >
          {/* 봉투 안쪽 */}
          <div className="envelope-back absolute inset-0 bg-envelope-shade" />

          {/* 카드 */}
          <div
            className={cn(
              "invitation-paper absolute inset-x-[12%] bottom-2 z-[5] h-[90%] bg-paper px-3 pt-5 text-center text-paper-foreground shadow-sm",
              lifted && "letter-rise-now z-[9]",
            )}
          >
            <p className="whitespace-nowrap font-display text-[2.2rem] leading-none text-paper-foreground">
              Save the Date
            </p>
            <p className="mt-2 whitespace-nowrap text-[0.82rem] font-medium tracking-[0.08em] text-paper-foreground">
              이상진 <span className="mx-1">·</span> 최효정
            </p>
            <div className="mt-7 space-y-1 text-[0.7rem] leading-snug tracking-wide text-paper-foreground/90">
              <p>2027.03.14 일요일 오후 1시</p>
              <p>일산 웨스턴빌리프 웨딩홀(9F)</p>
            </div>
          </div>

          {/* 앞 주머니: 좌우·아래 접힘 */}
          <svg
            viewBox="0 0 100 70"
            preserveAspectRatio="none"
            className="envelope-front pointer-events-none absolute inset-0 z-10 !size-full"
            aria-hidden
          >
            <path d="M0 0 L52 40 L0 70 Z" className="fill-envelope" />
            <path d="M100 0 L48 40 L100 70 Z" className="fill-envelope" />
            <path d="M0 70 L50 34 L100 70 Z" className="fill-envelope" />
            <path
              d="M0 70 L50 34 L100 70"
              className="stroke-envelope-shade"
              strokeWidth="0.65"
              fill="none"
            />
            <path
              d="M0 0 L42 37 M100 0 L58 37"
              className="stroke-envelope-shade"
              strokeWidth="0.45"
              fill="none"
              opacity="0.75"
            />
          </svg>

          <div
            className="envelope-finish pointer-events-none absolute inset-0 z-[15]"
            aria-hidden
          />
          <div
            className={cn(
              "envelope-stitches pointer-events-none absolute inset-[4%]",
              phase === "closed" ? "z-[16]" : "z-[8]",
            )}
            aria-hidden
          />

          {/* 덮개 */}
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className={cn(
              "envelope-flap pointer-events-none absolute inset-x-0 top-0 !h-[57%] !w-full",
              phase === "closed"
                ? "z-20"
                : phase === "opening"
                  ? "flap-open z-20"
                  : "flap-open z-[1]",
            )}
            aria-hidden
          >
            <path d="M0 0 L100 0 L50 40 Z" className="fill-envelope" />
            <path
              d="M0 0 L50 40 L100 0"
              className="stroke-envelope-shade"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>

          {/* 실링 왁스 */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-all duration-500",
              phase === "closed" ? "opacity-100" : "scale-110 opacity-0",
            )}
            style={{ top: "14%" }}
            aria-hidden
          >
            <svg viewBox="0 0 100 100" className="!size-[45px] shrink-0 drop-shadow-md">
              <defs>
                <radialGradient id="wax-body" cx="30%" cy="24%" r="82%">
                  <stop offset="0%" stopColor={WAX.light} />
                  <stop offset="48%" stopColor={WAX.mid} />
                  <stop offset="100%" stopColor={WAX.dark} />
                </radialGradient>
                <radialGradient id="wax-gloss" cx="28%" cy="20%" r="70%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle
                cx="50"
                cy="50"
                r="44"
                fill="url(#wax-body)"
                stroke={WAX.edge}
                strokeWidth="1"
              />
              <circle
                cx="50"
                cy="50"
                r="38.5"
                fill="none"
                stroke="#fff"
                strokeOpacity="0.72"
                strokeWidth="0.8"
              />
              <circle cx="50" cy="50" r="34" fill="url(#wax-gloss)" />
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="20"
                letterSpacing="1"
                fill="#fff"
                opacity="0.92"
              >
                S · H
              </text>
            </svg>
          </div>
        </Button>

        {phase === "closed" && (
          <p className="envelope-open-hint mt-8 text-[13px] text-foreground/70">
            탭해서 열어보세요
          </p>
        )}

        {phase === "open" && (
          <div className="envelope-details animate-in fade-in slide-in-from-bottom-3 mt-8 w-full duration-500">
            <div className="space-y-2">
              {showRsvp ? (
                <div className="soft-card p-4">
                  <RsvpForm
                    onDone={onClose}
                    onCancel={() => setShowRsvp(false)}
                    defaultName={guestName === "소중한 분" ? "" : guestName}
                  />
                </div>
              ) : (
                <>
                  <Button className="w-full rounded-full" onClick={() => setShowRsvp(true)}>
                    참석 여부 알려주기
                  </Button>
                  <Button variant="secondary" className="w-full rounded-full" onClick={onClose}>
                    청첩장 열어보기
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
