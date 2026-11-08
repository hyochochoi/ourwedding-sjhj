import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "rising" | "open";

const WAX_PALETTES = {
  pearl: { light: "#FFFFFF", mid: "#F6F3EB", dark: "#D9D3C6", edge: "#A59E8E", ink: "#A59E8E" },
  burgundy: { light: "#B8404E", mid: "#8C1D2C", dark: "#5E0F1C", edge: "#45090F", ink: "#45090F" },
  rose: { light: "#DDA5AA", mid: "#B8737C", dark: "#8A4D56", edge: "#6B3841", ink: "#6B3841" },
  ice: { light: "#B4CCDA", mid: "#7F9EB3", dark: "#566F82", edge: "#415667", ink: "#415667" },
} as const;

// 'pearl' | 'burgundy' | 'rose' | 'ice' 중에서 고르면 왁스 색이 바뀝니다
const WAX = WAX_PALETTES.pearl;

// 거의 완전한 원에 아주 미세한 불규칙함만 준 왁스 외곽
const WAX_OUTLINE = (() => {
  const n = 120;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = 44 + 0.9 * Math.sin(4 * t + 0.6) + 0.6 * Math.sin(7 * t + 2);
    pts.push(`${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

// 조개(가리비) 모양 무늬: 아래 꼭짓점에서 부채꼴로 퍼지는 물결 가장자리 + 골
const SHELL = (() => {
  const cx = 50;
  const cy = 67;
  const R = 38;
  const lobes = 7;
  const a0 = -63;
  const step = 126 / lobes;
  const rad = (d: number) => (d * Math.PI) / 180;
  const P = (deg: number, r: number) => [cx + r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))];
  const f = (n: number) => n.toFixed(2);

  const start = P(a0, R);
  let outline = `M${cx} ${cy} L${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < lobes; i++) {
    const mid = P(a0 + step * (i + 0.5), R * 1.12);
    const end = P(a0 + step * (i + 1), R);
    outline += ` Q${f(mid[0])} ${f(mid[1])} ${f(end[0])} ${f(end[1])}`;
  }
  outline += " Z";

  let ribs = "";
  for (let i = 0; i <= lobes * 2; i++) {
    const deg = a0 + (step / 2) * i;
    const end = P(deg, i % 2 === 0 ? R * 0.96 : R * 1.04);
    ribs += `M${cx} ${cy - 2} L${f(end[0])} ${f(end[1])} `;
  }

  // 아래쪽 귀(힌지) 부분
  const ears = `M${cx} ${cy - 1} L${cx - 14} ${cy + 4} Q${cx - 12} ${cy + 10} ${cx} ${cy + 9} Q${cx + 12} ${cy + 10} ${cx + 14} ${cy + 4} Z`;

  return { outline, ribs, ears };
})();

function WaxShell({
  fill,
  stroke,
  strokeWidth = 0,
  rib,
  ribWidth = 0.8,
  ribOpacity = 1,
}: {
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  rib: string;
  ribWidth?: number;
  ribOpacity?: number;
}) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={SHELL.ears} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <path d={SHELL.outline} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <path d={SHELL.ribs} fill="none" stroke={rib} strokeWidth={ribWidth} opacity={ribOpacity} />
    </g>
  );
}

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
          <h1 className="font-display text-[3.2rem] leading-none text-primary">
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

          {/* 실링 왁스 */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-all duration-500",
              phase === "closed" ? "opacity-100" : "scale-110 opacity-0",
            )}
            style={{ top: "14%" }}
            aria-hidden
          >
            <svg viewBox="0 0 100 100" className="!size-[68px] shrink-0 drop-shadow-md">
              <defs>
                <radialGradient id="wax-body" cx="32%" cy="28%" r="85%">
                  <stop offset="0%" stopColor={WAX.light} />
                  <stop offset="55%" stopColor={WAX.mid} />
                  <stop offset="100%" stopColor={WAX.dark} />
                </radialGradient>
              </defs>

              {/* 둥근 바깥 왁스 */}
              <path d={WAX_OUTLINE} fill="url(#wax-body)" stroke={WAX.edge} strokeWidth="0.8" />

              {/* 도톰하게 올라온 테두리 */}
              <circle cx="50" cy="50" r="38" fill="none" stroke={WAX.edge} strokeWidth="0.9" opacity="0.5" />
              <circle cx="50" cy="50" r="39.6" fill="none" stroke="#fff" strokeWidth="1" opacity="0.9" />

              {/* 양각 조개 무늬: 하이라이트 → 그림자 → 본체 */}
              <g transform="translate(0.8 0.9)" opacity="0.95">
                <WaxShell fill="#fff" rib="#fff" ribWidth={0.9} />
              </g>
              <g transform="translate(-0.6 -0.6)" opacity="0.45">
                <WaxShell fill={WAX.edge} rib={WAX.edge} ribWidth={0.9} />
              </g>
              <WaxShell fill={WAX.mid} stroke={WAX.edge} strokeWidth={0.5} rib={WAX.edge} ribWidth={0.7} ribOpacity={0.75} />

              {/* 광택 */}
              <path
                d="M22 24 C30 14 43 10 56 11"
                fill="none"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.55"
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
