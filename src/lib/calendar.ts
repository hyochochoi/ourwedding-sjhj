import { WEDDING } from "@/lib/wedding-data";

/** 2027-03-14 13:00 KST → UTC */
export const START_UTC = "20270314T040000Z";
export const END_UTC = "20270314T060000Z";
export const EVENT_TITLE = `${WEDDING.groom.name} ♥ ${WEDDING.bride.name} 결혼식`;

export function buildIcs() {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding//invitation//KR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:sangjin-hyojung-20270314@wedding",
    "DTSTAMP:20260101T000000Z",
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `SUMMARY:${EVENT_TITLE}`,
    `LOCATION:${WEDDING.venue} ${WEDDING.hall}\\, ${WEDDING.address}`,
    `DESCRIPTION:${WEDDING.dateLabel} ${WEDDING.venue} ${WEDDING.hall}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:내일은 ${EVENT_TITLE}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${START_UTC}/${END_UTC}`,
    details: `${WEDDING.venue} ${WEDDING.hall}`,
    location: WEDDING.address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
