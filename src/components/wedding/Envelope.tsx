import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "rising" | "open";

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
          <h1 className="font-display text-[2.8rem] leading-none text-primary">
            Wedding Invitation
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-foreground/90">
            저희의 특별한 날에 {guestName === "소중한 분" ? "당신" : `${guestName}님`}을 초대합니다.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={open}
          aria-label="봉투 열기"
          className={cn(
            "envelope-stage relative block h-auto w-full shrink-0 rounded-none p-0 hover:bg-transparent",
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
              lifted && "letter-rise-now",
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
            className="envelope-stitches pointer-events-none absolute inset-[4%] z-[16]"
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
          {/* 새틴 리본 */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 transition-all duration-500",
              phase === "closed" ? "opacity-100" : "scale-110 opacity-0",
            )}
            aria-hidden
          >
            <div className="ribbon-band absolute inset-x-0 top-[57%] h-[13%] -translate-y-1/2" />
            <svg
              viewBox="0 0 120 90"
              className="ribbon-bow absolute left-1/2 top-[57%] !h-auto !w-[46%] -translate-x-1/2 -translate-y-[42%]"
            >
              <defs>
                <linearGradient id="satin" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" style={{ stopColor: "var(--ribbon-light)" }} />
                  <stop offset="0.5" style={{ stopColor: "var(--ribbon)" }} />
                  <stop offset="1" style={{ stopColor: "var(--ribbon-dark)" }} />
                </linearGradient>
              </defs>
              {/* 꼬리 */}
              <path d="M56 34 L34 86 L42 80 L47 88 L62 38 Z" fill="url(#satin)" />
              <path d="M64 34 L86 86 L78 80 L73 88 L58 38 Z" fill="url(#satin)" />
              {/* 루프 */}
              <path d="M60 32 C44 10 14 6 8 18 C2 32 26 44 60 38 Z" fill="url(#satin)" />
              <path d="M60 32 C76 10 106 6 112 18 C118 32 94 44 60 38 Z" fill="url(#satin)" />
              <path
                d="M58 33 C42 20 22 16 16 22"
                fill="none"
                style={{ stroke: "var(--ribbon-light)" }}
                strokeWidth="1.2"
                opacity="0.7"
              />
              <path
                d="M62 33 C78 20 98 16 104 22"
                fill="none"
                style={{ stroke: "var(--ribbon-light)" }}
                strokeWidth="1.2"
                opacity="0.7"
              />
              {/* 매듭 */}
              <rect
                x="53"
                y="28"
                width="14"
                height="14"
                rx="4"
                fill="url(#satin)"
                className="ribbon-knot"
              />
              <path
                d="M56 30 Q60 28 64 30"
                fill="none"
                style={{ stroke: "var(--ribbon-light)" }}
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M55 31 Q60 35 65 31"
                fill="none"
                style={{ stroke: "var(--ribbon-dark)" }}
                strokeWidth="1"
              />
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
