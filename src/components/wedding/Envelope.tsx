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
            이상진 · 최효정, 저희 둘의
            <br />
            가장 특별한 순간에{" "}
            <span className="text-[calc(1em+0.5px)] font-semibold">
              {guestName === "소중한 분" ? "당신" : `${guestName}님`}
            </span>
            을 초대합니다.
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

          {/* 봉투 중앙 크기에 맞춘 아이보리 무늬 없는 실링 왁스 */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 transition-all duration-500 flex items-center justify-center",
              phase === "closed" ? "opacity-100" : "scale-110 opacity-0",
            )}
            style={{ top: "14%" }}
            aria-hidden
          >
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16 shrink-0 drop-shadow-md"
            >
              <defs>
                <radialGradient id="ivory-wax-grad" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#fefcf8" />
                  <stop offset="75%" stopColor="#f3ede2" />
                  <stop offset="100%" stopColor="#ded4c3" />
                </radialGradient>
                <filter id="ivory-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* 왁스 외곽 무늬 없는 형태 */}
              <path
                d="M50 7 
                   C64 6, 73 12, 84 19 
                   C93 27, 97 39, 94 53 
                   C91 68, 83 79, 71 87 
                   C58 94, 42 94, 28 87 
                   C15 80, 6 68, 7 53 
                   C8 38, 16 26, 27 16 
                   C38 9, 43 8, 50 7 Z"
                fill="url(#ivory-wax-grad)"
                filter="url(#ivory-shadow)"
              />

              {/* 안쪽 음각 림 (테두리) */}
              <path
                d="M50 17 
                   C61 16, 69 21, 76 27 
                   C83 34, 85 43, 83 52 
                   C81 62, 75 70, 65 76 
                   C55 82, 43 81, 33 76 
                   C23 71, 17 61, 18 51 
                   C19 40, 25 31, 33 24 
                   C41 18, 45 17, 50 17 Z"
                fill="none"
                stroke="#c7baa4"
                strokeWidth="1.4"
                opacity="0.6"
              />

              {/* 안쪽 왁스 면 */}
              <path
                d="M50 19 
                   C60 18, 67 22, 74 28 
                   C80 34, 82 43, 80 51 
                   C78 60, 72 68, 63 73 
                   C54 78, 44 77, 34 73 
                   C25 69, 19 60, 20 50 
                   C21 40, 26 32, 34 25 
                   C42 19, 46 18, 50 19 Z"
                fill="url(#ivory-wax-grad)"
              />

              {/* 하이라이트 광택 */}
              <path
                d="M32 25 C41 19, 53 18, 62 21"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="27" cy="33" r="2.2" fill="#ffffff" opacity="0.6" />
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