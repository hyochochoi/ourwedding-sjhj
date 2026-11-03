import { useEffect, useRef, useState } from "react";
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    timer.current = setTimeout(() => setPhase("open"), 1700);
  }

  return (
    <div className="invitation-paper fixed inset-0 z-50 overflow-y-auto bg-cream px-6 text-paper-foreground">
      <div className="mx-auto flex min-h-full max-w-[320px] flex-col items-center justify-center py-8">
        <p className="font-display mb-8 text-3xl text-envelope-shade">Wedding Invitation</p>
        <Button
          type="button"
          variant="ghost"
          onClick={open}
          aria-label="봉투 열기"
          className={cn(
            "envelope-stage relative block h-auto w-full shrink-0 rounded-none p-0 hover:bg-transparent",
            phase === "closed" ? "mt-0" : "mt-24",
          )}
        >
          {/* 편지지: 약 50%만 빠져나옴 */}
          <div
            className={cn(
              "invitation-paper absolute inset-x-10 bottom-3 z-[5] h-[88%] bg-paper px-3 pt-5 text-center text-paper-foreground",
              phase !== "closed" && "letter-rise",
            )}
          >
            <p className="font-display text-[2.75rem] leading-[0.85] text-envelope-shade">Save the<br />Date</p>
            <p className="serif-title mt-4 text-xs">To. {guestName} 님</p>
            <p className="mt-2 text-[0.65rem]">{WEDDING.groom.name} &amp; {WEDDING.bride.name}</p>
          </div>

          {/* 봉투 몸통 */}
          <div className="envelope-back absolute inset-0 bg-envelope-shade" />
          <div className="envelope-front absolute inset-0 z-10 bg-envelope [clip-path:polygon(0_0,50%_48%,100%_0,100%_100%,0_100%)]" />
          {/* 덮개 */}
          <div
            className={cn(
              "envelope-flap absolute inset-x-0 top-0 h-[48%] bg-envelope [clip-path:polygon(0_0,100%_0,50%_100%)]",
              phase === "closed" ? "z-20" : phase === "opening" ? "flap-open z-20" : "flap-open z-0",
            )}
          />
          {/* 실링 + 받는 분 */}
          {phase === "closed" && <span className="blank-seal absolute left-1/2 top-[48%] z-30 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" aria-hidden />}
        </Button>

        <div className="mt-8 w-full text-center">
          <p className="font-display text-2xl text-envelope-shade">Sang Jin &amp; Hyo Jeong</p>
          <p className="mt-3 text-3xl text-envelope-shade">2027.03.14</p>
          <p className="mt-1 text-xs text-paper-foreground/70">SUNDAY · 1:00 PM</p>
          <div className="mx-auto my-5 h-px w-6 bg-envelope/40" />
          <p className="text-sm">{WEDDING.venue} {WEDDING.hall}</p>
          <p className="mt-1 text-xs text-paper-foreground/60">{WEDDING.addressShort}</p>
        </div>

        {phase === "open" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 mt-6 w-full space-y-2 duration-500">
            {showRsvp ? (
              <div className="soft-card p-4">
                <RsvpForm onDone={onClose} onCancel={() => setShowRsvp(false)} defaultName={guestName === "소중한 분" ? "" : guestName} />
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
