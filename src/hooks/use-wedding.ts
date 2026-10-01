import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

const TARGET = new Date(WEDDING.dateISO).getTime();

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
};

function diff(now: number): Countdown {
  const ms = Math.max(0, TARGET - now);
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
    past: TARGET - now <= 0,
  };
}

/** 실시간 D-day 카운트다운 (하이드레이션 이후에만 갱신) */
export function useCountdown(): Countdown | null {
  const [value, setValue] = useState<Countdown | null>(null);

  useEffect(() => {
    setValue(diff(Date.now()));
    const id = window.setInterval(() => setValue(diff(Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return value;
}

/** 스크롤 진입 시 부드러운 페이드인 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
