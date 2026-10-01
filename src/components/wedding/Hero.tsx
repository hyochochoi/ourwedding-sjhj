import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { WEDDING } from "@/lib/wedding-data";
import { useCountdown } from "@/hooks/use-wedding";

function Unit({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex min-w-[3.2rem] flex-col items-center rounded-xl border border-primary/30 bg-black/25 px-2 py-1.5 backdrop-blur-sm">
      <span className="text-base font-medium text-primary tabular-nums">
        {value}
      </span>
      <span className="text-[0.6rem] tracking-widest text-foreground/80">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const countdown = useCountdown();

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <img
        src={heroImage}
        alt={`${WEDDING.groom.name} 그리고 ${WEDDING.bride.name}`}
        width={1024}
        height={1536}
        className="no-zoom absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/75" />

      <div className="relative flex h-full flex-col items-center justify-between px-6 py-12 text-center">
        <div className="pt-6">
          <p className="text-[0.7rem] tracking-[0.5em] text-primary uppercase">
            We are getting married
          </p>
        </div>

        <div>
          <h1 className="serif-title text-3xl leading-relaxed text-foreground drop-shadow">
            {WEDDING.groom.name}
            <span className="mx-3 text-primary">·</span>
            {WEDDING.bride.name}
          </h1>
          <p className="mt-3 text-sm text-foreground/90">{WEDDING.dateLabel}</p>
          <p className="text-sm text-foreground/80">
            {WEDDING.venue} {WEDDING.hall}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Unit value={countdown ? countdown.days : "–"} label="DAYS" />
            <Unit value={countdown ? countdown.hours : "–"} label="HOUR" />
            <Unit value={countdown ? countdown.minutes : "–"} label="MIN" />
            <Unit value={countdown ? countdown.seconds : "–"} label="SEC" />
          </div>
        </div>

        <div className="bounce-hint flex flex-col items-center gap-1 text-primary">
          <span className="text-[0.65rem] tracking-[0.3em]">SCROLL</span>
          <ChevronDown className="size-5" />
        </div>
      </div>
    </section>
  );
}
