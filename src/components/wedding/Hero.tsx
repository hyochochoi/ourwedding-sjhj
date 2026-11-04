import { COVER_PHOTO as heroImage } from "@/lib/wedding-photos";
import { HERO_VIDEO_URL, WEDDING } from "@/lib/wedding-data";

function PaperClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 64" className={className} aria-hidden fill="none">
      <path
        d="M8 20 V50 a6 6 0 0 0 12 0 V12 a8 8 0 0 0 -16 0 V48"
        className="stroke-clip"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="cover-paper relative w-full overflow-hidden bg-background pb-8 pt-8 text-center">
      <p className="text-[0.65rem] tracking-[0.3em] text-cream/80">SANG JIN &amp; HYO JEONG</p>
      <h1 className="font-cover relative z-10 mt-6 -rotate-6 text-[5.5rem] font-normal leading-[0.78] text-cream">
        Our
        <br />
        Wedding
      </h1>

      <div className="relative mx-auto mt-2 aspect-[100/96] w-[94%]">
        <svg viewBox="0 0 100 96" className="absolute inset-0 size-full drop-shadow-lg" aria-hidden>
          <path
            d="M50 96 C28 80 0 60 0 30 C0 11 12 0 27 0 C39 0 46 8 50 18 C54 8 61 0 73 0 C88 0 100 11 100 30 C100 60 72 80 50 96 Z"
            className="fill-cream"
          />
        </svg>
        <div className="absolute left-1/2 top-[13%] w-[40%] -translate-x-1/2 rotate-[-2deg] bg-paper p-1.5 shadow-md">
          <PaperClip className="absolute -top-6 right-3 z-10 h-12 w-4 rotate-[8deg]" />
          {HERO_VIDEO_URL ? (
            <video src={HERO_VIDEO_URL} poster={heroImage} autoPlay muted loop playsInline className="no-zoom aspect-[4/5] w-full object-cover" />
          ) : (
            <img src={heroImage} alt={`${WEDDING.groom.name} 그리고 ${WEDDING.bride.name}`} className="no-zoom aspect-[4/5] w-full object-cover" />
          )}
        </div>
        <div className="absolute inset-x-[22%] top-[62%] text-paper-foreground">
          <p className="serif-title text-[0.95rem] font-semibold">
            {WEDDING.groom.name} <span className="text-envelope">♥</span> {WEDDING.bride.name}
          </p>
          <p className="mt-1 text-[0.65rem] opacity-80">2027. 03. 14 SUN 1:00 PM</p>
          <p className="text-[0.65rem] opacity-80">{WEDDING.venue}</p>
        </div>
      </div>
    </section>
  );
}
