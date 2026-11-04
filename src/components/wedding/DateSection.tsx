import { CalendarPlus, Heart } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";
import { useCountdown } from "@/hooks/use-wedding";
import { googleCalendarUrl } from "@/lib/calendar";
import { cn } from "@/lib/utils";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
// 2027년 3월 1일은 월요일
const CELLS: (number | null)[] = [null, ...Array.from({ length: 31 }, (_, i) => i + 1)];

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
        <p className="serif-title mb-3 text-center text-lg">3월</p>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {DAYS.map((w, i) => (
            <span key={w} className={cn("py-1 text-xs", i === 0 ? "text-destructive" : i === 6 ? "text-primary" : "text-muted-foreground")}>{w}</span>
          ))}
          {CELLS.map((d, i) => {
            const isDay = d === 14;
            return (
              <div key={i} className="relative flex h-10 items-center justify-center">
                {isDay && <Heart className="absolute size-9 fill-primary text-primary" aria-hidden />}
                <span className={cn("relative text-sm tabular-nums", isDay ? "font-semibold text-primary-foreground" : i % 7 === 0 ? "text-destructive" : "")}>{d ?? ""}</span>
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
          {WEDDING.groom.name} <span className="text-primary">♥</span> {WEDDING.bride.name}의 결혼식이{" "}
          <span className="mx-0.5 text-2xl font-semibold text-primary">{countdown ? countdown.days : "–"}일</span> 남았습니다
        </p>
      </div>

      <Button className="mt-5 w-full rounded-full" onClick={saveToCalendar}>
        <CalendarPlus className="size-4" /> 내 캘린더에 저장하기
      </Button>
    </Section>
  );
}
