import { COVER_PHOTO as heroImage } from "@/lib/wedding-photos";
import { HERO_VIDEO_URL, WEDDING } from "@/lib/wedding-data";

function PaperClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 60" className={className} aria-hidden fill="none">
      <path
        d="M6 16 V46 a4 4 0 0 0 8 0 V8 a6 6 0 0 0 -12 0 V50 a8 8 0 0 0 16 0 V14"
        className="stroke-clip"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="cover-paper relative w-full overflow-hidden bg-background pb-10 pt-8 text-center">
      <p className="serif-title text-[0.7rem] tracking-[0.3em] text-primary/80">SANG JIN &amp; HYO JEONG</p>
      <h1 className="font-cover relative z-10 mt-5 -rotate-3 text-[5rem] font-normal leading-[0.8] text-primary">
        Our
        <br />
        Wedding
      </h1>

      <div className="relative -mt-6 mx-auto aspect-[100/92] w-[104%] -translate-x-[2%]">
        <svg viewBox="0 0 100 92" className="absolute inset-0 size-full drop-shadow-xl" aria-hidden>
          <path
            d="M50 92 C30 78 0 58 0 28 C0 10 12 0 26 0 C38 0 46 7 50 16 C54 7 62 0 74 0 C88 0 100 10 100 28 C100 58 70 78 50 92 Z"
            className="fill-cream"
          />
        </svg>
        <div className="absolute left-1/2 top-[19%] w-[44%] -translate-x-1/2 shadow-lg">
          <PaperClip className="absolute -top-5 right-4 z-10 h-12 w-4 rotate-[6deg]" />
          {HERO_VIDEO_URL ? (
            <video src={HERO_VIDEO_URL} poster={heroImage} autoPlay muted loop playsInline className="no-zoom aspect-square w-full object-cover" />
          ) : (
            <img src={heroImage} alt={`${WEDDING.groom.name} 그리고 ${WEDDING.bride.name}`} className="no-zoom aspect-square w-full object-cover" />
          )}
        </div>
        <div className="absolute inset-x-[24%] top-[64%] text-paper-foreground">
          <p className="text-base font-semibold tracking-wide">
            {WEDDING.groom.name} <span className="mx-1 font-light">—</span> {WEDDING.bride.name}
          </p>
          <p className="mt-1.5 text-[0.68rem] opacity-80">2027. 03. 14 일요일 오후 1시</p>
          <p className="text-[0.68rem] opacity-80">{WEDDING.venue}</p>
        </div>
      </div>
    </section>
  );
}
