import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

type Phase = "closed" | "opening" | "letter";

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
    window.setTimeout(() => setPhase("letter"), 1700);
  }

  return (
    <div className="dotted-bg fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-5 py-8">
      {phase !== "letter" ? (
        <button
          type="button"
          onClick={open}
          aria-label="봉투 열기"
          className="relative aspect-[4/3] w-full max-w-[340px] [perspective:1000px]"
        >
          {/* 편지지 */}
          <div
            className={cn(
              "absolute inset-x-4 top-3 bottom-3 rounded-md bg-paper px-5 pt-6 text-left text-paper-foreground shadow",
              phase === "opening" && "letter-rise",
            )}
          >
            <p className="serif-title text-base">To. {guestName}</p>
            <p className="mt-2 text-xs opacity-70">{WEDDING.dateLabel}</p>
          </div>
          {/* 봉투 몸통 */}
          <div className="absolute inset-0 z-10 rounded-lg bg-envelope shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
          {/* 봉투 덮개 */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-20 h-[58%] bg-envelope-shade [clip-path:polygon(0_0,100%_0,50%_100%)] [backface-visibility:hidden]",
              phase === "opening" && "flap-open z-0",
            )}
          />
          {/* 실링 & 받는 분 */}
          <div className="absolute inset-x-0 bottom-6 z-30 text-center text-paper-foreground">
            <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow serif-title text-sm">
              ♥
            </span>
            <p className="serif-title text-lg">To. {guestName}</p>
            {phase === "closed" && (
              <p className="bounce-hint mt-2 text-[0.7rem] opacity-70">
                봉투를 눌러 열어보세요
              </p>
            )}
          </div>
        </button>
      ) : (
        <div className="animate-in fade-in zoom-in-95 my-auto w-full max-w-[400px] rounded-3xl bg-paper p-6 text-paper-foreground shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] duration-500">
          <p className="serif-title text-lg">To. {guestName}</p>
          <p className="mt-3 text-sm leading-relaxed opacity-80">
            {WEDDING.groom.name} · {WEDDING.bride.name}의 결혼식에
            <br />
            소중한 {guestName === "소중한 분" ? "분을" : `${guestName}님을`}{" "}
            초대합니다.
          </p>

          <div className="mt-5 space-y-3 rounded-2xl bg-envelope p-4 text-sm">
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-4 shrink-0 opacity-70" />
              2027년 3월 14일 일요일
            </p>
            <p className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 opacity-70" />
              오후 1시 예식
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" />
              <span>
                {WEDDING.venue} {WEDDING.hall}
                <br />
                <span className="text-xs opacity-70">{WEDDING.address}</span>
              </span>
            </p>
          </div>

          {showRsvp ? (
            <div className="mt-5 rounded-2xl bg-background p-4 text-foreground">
              <RsvpForm onDone={onClose} />
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              <Button
                className="w-full rounded-full"
                onClick={() => setShowRsvp(true)}
              >
                참석 여부 알려주기
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full border-paper-foreground/30 bg-transparent text-paper-foreground hover:bg-envelope"
                onClick={onClose}
              >
                청첩장 열어보기
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
