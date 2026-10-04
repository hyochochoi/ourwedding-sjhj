import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "open";

export function Envelope({
  guestName,
  onClose,
}: {
  guestName: string;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [showRsvp, setShowRsvp] = useState(false);

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 1700);
  }

  return (
    <div className="dotted-bg fixed inset-0 z-50 overflow-y-auto px-5">
      <div className="mx-auto flex min-h-full max-w-[360px] flex-col items-center justify-center py-10">
        <button
          type="button"
          onClick={open}
          aria-label="봉투 열기"
          className={cn(
            "relative w-full shrink-0 transition-[margin] duration-700 [perspective:1000px]",
            phase === "closed" ? "mt-0" : "mt-40",
          )}
          style={{ aspectRatio: "4 / 3" }}
        >
          {/* 편지지: 약 50%만 빠져나옴 */}
          <div
            className={cn(
              "absolute inset-x-5 bottom-3 z-[5] h-[92%] rounded-md bg-cream px-5 pt-5 text-left text-paper-foreground shadow-md",
              phase !== "closed" && "letter-rise",
            )}
          >
            <p className="text-[0.65rem] tracking-[0.3em] opacity-60">INVITATION</p>
            <p className="serif-title mt-1 text-lg">To. {guestName}</p>
            <div className="mt-3 space-y-1 text-xs leading-relaxed">
              <p>2027. 03. 14 SUN · 오후 1시</p>
              <p>
                {WEDDING.venue} {WEDDING.hall}
              </p>
              <p className="opacity-60">{WEDDING.addressShort}</p>
            </div>
          </div>

          {/* 봉투 몸통 */}
          <div className="absolute inset-0 z-10 rounded-lg bg-envelope shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] [clip-path:polygon(0_0,50%_52%,100%_0,100%_100%,0_100%)]" />
          {/* 덮개 */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-[55%] rounded-t-lg bg-envelope-shade [clip-path:polygon(0_0,100%_0,50%_100%)]",
              phase === "closed" ? "z-20" : "flap-open z-0",
            )}
          />
          {/* 실링 + 받는 분 */}
          <div className="absolute inset-x-0 bottom-5 z-30 text-center text-cream">
            {phase === "closed" && (
              <span className="serif-title mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                🌿
              </span>
            )}
            <p className="serif-title text-base">To. {guestName}</p>
            {phase === "closed" && (
              <p className="bounce-hint mt-1 text-[0.7rem] opacity-80">
                봉투를 눌러 열어보세요
              </p>
            )}
          </div>
        </button>

        {phase === "open" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 mt-6 w-full space-y-2 duration-500">
            {showRsvp ? (
              <div className="soft-card p-4">
                <RsvpForm onDone={onClose} defaultName={guestName === "소중한 분" ? "" : guestName} />
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
        )}
      </div>
    </div>
  );
}
