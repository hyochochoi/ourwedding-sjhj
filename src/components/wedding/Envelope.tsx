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
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function open() {
    if (phase !== "closed") return;
    setPhase("opening");
    timer.current = setTimeout(() => {
      setPhase("rising");
      timer.current = setTimeout(() => setPhase("open"), 1000);
    }, 900);
  }
  const lifted = phase === "rising" || phase === "open";

  return (
    <div className="cover-paper fixed inset-0 z-50 overflow-y-auto bg-background px-6 text-foreground">
      <div className="mx-auto flex min-h-full max-w-[320px] flex-col items-center justify-center py-10">
        <p className="mb-14 text-[0.7rem] tracking-[0.35em] text-primary/80">WEDDING INVITATION</p>
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
          {/* 봉투 안쪽 */}
          <div className="envelope-back absolute inset-0 bg-envelope-shade" />
          {/* 카드 */}
          <div
            className={cn(
              "invitation-paper absolute inset-x-[12%] bottom-2 z-[5] h-[90%] bg-paper px-3 pt-5 text-center text-paper-foreground shadow-sm",
              lifted && "letter-rise-now",
            )}
          >
            <p className="font-display text-[2.6rem] leading-[0.85] text-paper-foreground">Save the<br />Date</p>
            <p className="mt-3 text-xs">To. {guestName} 님</p>
            <p className="mt-1 text-[0.65rem] opacity-70">{WEDDING.groom.name} &amp; {WEDDING.bride.name}</p>
          </div>
          {/* 앞 주머니: 좌우·아래 접힘 */}
          <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="envelope-front pointer-events-none absolute inset-0 z-10 !size-full" aria-hidden>
            <path d="M0 0 L52 40 L0 70 Z" className="fill-envelope" />
            <path d="M100 0 L48 40 L100 70 Z" className="fill-envelope" />
            <path d="M0 70 L50 34 L100 70 Z" className="fill-envelope" />
            <path d="M0 70 L50 34 L100 70" className="stroke-envelope-shade" strokeWidth="0.5" fill="none" />
            <path d="M0 0 L42 37 M100 0 L58 37" className="stroke-envelope-shade" strokeWidth="0.35" fill="none" opacity="0.7" />
          </svg>
          {/* 덮개 */}
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className={cn(
              "envelope-flap pointer-events-none absolute inset-x-0 top-0 !h-[57%] !w-full",
              phase === "closed" ? "z-20" : phase === "opening" ? "flap-open z-20" : "flap-open z-[1]",
            )}
            aria-hidden
          >
            <path d="M0 0 L100 0 L50 40 Z" className="fill-envelope" />
            <path d="M0 0 L50 40 L100 0" className="stroke-envelope-shade" strokeWidth="0.5" fill="none" />
          </svg>
          {phase === "closed" && (
            <span className="blank-seal absolute left-1/2 top-[57%] z-30 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" aria-hidden />
          )}
        </Button>

        <div className="mt-12 w-full text-center">
          <p className="text-sm tracking-[0.3em] text-primary/80">SANG JIN <span className="text-primary">&amp;</span> HYO JEONG</p>
          <p className="mt-4 text-4xl font-light tracking-wide text-primary">2027.03.14</p>
          <p className="mt-2 text-xs tracking-[0.3em] text-foreground/70">SUNDAY · 1:00 PM</p>
          <div className="mx-auto my-5 h-px w-8 bg-primary/40" />
          <p className="text-sm">{WEDDING.venue} {WEDDING.hall}</p>
          <p className="mt-1 text-xs tracking-wider text-foreground/60">{WEDDING.addressShort}</p>
        </div>

        {phase === "open" && (
          <div className="animate-in fade-in slide-in-from-bottom-3 mt-6 w-full space-y-2 duration-500">
            {showRsvp ? (
              <div className="soft-card p-4">
                <RsvpForm onDone={onClose} onCancel={() => setShowRsvp(false)} defaultName={guestName === "소중한 분" ? "" : guestName} />
              </div>
            ) : (
              <>
                <Button className="w-full rounded-full" onClick={() => setShowRsvp(true)}>참석 여부 알려주기</Button>
                <Button variant="secondary" className="w-full rounded-full" onClick={onClose}>청첩장 열어보기</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
