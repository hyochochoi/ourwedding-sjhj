import { CalendarPlus } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";
import { useCountdown } from "@/hooks/use-wedding";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const YEAR = 2027;
const MONTH = 2; // 0-indexed: 3월
const DAY = 14;

function buildCells() {
  const first = new Date(YEAR, MONTH, 1).getDay();
  const total = new Date(YEAR, MONTH + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: first }, () => null);
  for (let d = 1; d <= total; d += 1) cells.push(d);
  return cells;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** 2027-03-14 13:00 KST → UTC 형식 */
const START_UTC = "20270314T040000Z";
const END_UTC = "20270314T060000Z";
const TITLE = `${WEDDING.groom.name} ♥ ${WEDDING.bride.name} 결혼식`;

function googleUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    dates: `${START_UTC}/${END_UTC}`,
    details: `${WEDDING.venue} ${WEDDING.hall}`,
    location: WEDDING.address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding//invitation//KR",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding`,
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `SUMMARY:${TITLE}`,
    `LOCATION:${WEDDING.address}`,
    `DESCRIPTION:${WEDDING.venue} ${WEDDING.hall}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "wedding.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export function DateSection() {
  const countdown = useCountdown();
  const cells = buildCells();

  return (
    <Section eyebrow="The Day" title="2027. 03. 14">
      <div className="soft-card p-5">
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs">
          {WEEKDAYS.map((w, i) => (
            <span
              key={w}
              className={cn(
                "pb-2 text-muted-foreground",
                i === 0 && "text-destructive/80",
              )}
            >
              {w}
            </span>
          ))}
          {cells.map((day, index) => (
            <span
              key={index}
              className={cn(
                "mx-auto flex size-8 items-center justify-center rounded-full",
                day === DAY &&
                  "bg-primary font-medium text-primary-foreground shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_22%,transparent)]",
                day !== DAY && index % 7 === 0 && "text-destructive/80",
              )}
            >
              {day ?? ""}
            </span>
          ))}
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {WEDDING.dateLabel}
        </p>
      </div>

      <div className="mt-5 text-center">
        <p className="serif-title text-sm">
          {WEDDING.groom.name} <span className="text-primary">❤</span>{" "}
          {WEDDING.bride.name}의 결혼식이{" "}
          <span className="text-primary">
            {countdown ? countdown.days : "–"}
          </span>
          일 남았습니다
        </p>
        <p className="mt-2 text-xs text-muted-foreground tabular-nums">
          {countdown
            ? `${countdown.days}일 ${pad(countdown.hours)}시간 ${pad(countdown.minutes)}분 ${pad(countdown.seconds)}초`
            : "계산 중..."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button className="rounded-full" onClick={downloadIcs}>
          <CalendarPlus className="size-4" /> 캘린더 저장
        </Button>
        <Button variant="secondary" className="rounded-full" asChild>
          <a href={googleUrl()} target="_blank" rel="noreferrer">
            구글 캘린더 추가
          </a>
        </Button>
      </div>
    </Section>
  );
}
