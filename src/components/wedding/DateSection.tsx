import { CalendarPlus } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";
import { useCountdown } from "@/hooks/use-wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { cn } from "@/lib/utils";

const WEEK = [
  { w: "MON", d: 8 },
  { w: "TUE", d: 9 },
  { w: "WED", d: 10 },
  { w: "THU", d: 11 },
  { w: "FRI", d: 12 },
  { w: "SAT", d: 13 },
  { w: "SUN", d: 14 },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function saveToCalendar() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    window.open(googleCalendarUrl(), "_blank", "noopener");
    return;
  }
  // iOS·Mac 사파리는 text/calendar 응답을 열면 "캘린더에 추가" 화면이 바로 뜹니다.
  window.location.href = "/api/public/wedding/ics";
}

export function DateSection() {
  const countdown = useCountdown();

  return (
    <Section eyebrow="The Day" title="2027. 03. 14">
      <div className="soft-card p-4">
        <p className="mb-3 text-center text-[0.7rem] tracking-[0.3em] text-muted-foreground">MARCH 2027</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEK.map(({ w, d }) => {
            const isDay = d === 14;
            return (
              <div
                key={w}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl py-2",
                  isDay && "bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_22%,transparent)]",
                )}
              >
                <span className={cn("text-[0.6rem] tracking-wider", isDay ? "font-medium" : "text-muted-foreground")}>{w}</span>
                <span className={cn("text-base tabular-nums", isDay && "font-semibold")}>{d}</span>
                {isDay && <span className="text-[0.55rem]">♥</span>}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">{WEDDING.dateLabel}</p>
      </div>

      <div className="mt-5 text-center">
        <div className="flex items-center justify-center gap-2">
          {[
            [countdown?.days ?? "–", "DAYS"],
            [countdown ? pad(countdown.hours) : "–", "HOUR"],
            [countdown ? pad(countdown.minutes) : "–", "MIN"],
            [countdown ? pad(countdown.seconds) : "–", "SEC"],
          ].map(([v, l]) => (
            <div key={l} className="flex min-w-[3.4rem] flex-col items-center rounded-xl border border-primary/30 px-2 py-1.5">
              <span className="text-base font-medium text-primary tabular-nums">{v}</span>
              <span className="text-[0.6rem] tracking-widest text-muted-foreground">{l}</span>
            </div>
          ))}
        </div>
        <p className="serif-title mt-4 text-sm">
          {WEDDING.groom.name} <span className="text-primary">❤</span> {WEDDING.bride.name}의 결혼식이{" "}
          <span className="text-primary">D-{countdown ? countdown.days : "–"}</span> 남았습니다
        </p>
      </div>

      <Button className="mt-5 w-full rounded-full" onClick={saveToCalendar}>
        <CalendarPlus className="size-4" /> 내 캘린더에 저장하기
      </Button>
    </Section>
  );
}
