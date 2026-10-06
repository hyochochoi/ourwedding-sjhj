import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";

const COLORS = ["var(--star-1)", "var(--star-2)", "var(--star-3)", "var(--star-4)", "var(--star-5)", "var(--primary)"];

export function WeddingDayPopup() {
  const [open, setOpen] = useState(true);
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 160,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
    })),
  );
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(false), 6000);
    return () => window.clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-8" onClick={() => setOpen(false)}>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece pointer-events-none absolute top-0 rounded-[2px]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6, background: p.color, animationDelay: `${p.delay}s`, ["--drift" as string]: `${p.drift}px` }}
        />
      ))}
      <div className="soft-card relative max-w-[300px] p-6 text-center">
        <p className="text-3xl">🎉</p>
        <p className="serif-title mt-2 text-lg">오늘입니다!</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {WEDDING.groom.name} 🤍 {WEDDING.bride.name}의 결혼식 · 오후 1시
        </p>
        <Button size="sm" className="mt-4 rounded-full" onClick={() => setOpen(false)}>
          청첩장 보기
        </Button>
      </div>
    </div>
  );
}
