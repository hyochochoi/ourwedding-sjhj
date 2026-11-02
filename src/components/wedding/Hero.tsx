import { COVER_PHOTO as heroImage } from "@/lib/wedding-photos";
import { HERO_VIDEO_URL, WEDDING } from "@/lib/wedding-data";

const HEART = "path('M50 92 C20 70 0 52 0 28 C0 12 12 0 27 0 C38 0 46 6 50 15 C54 6 62 0 73 0 C88 0 100 12 100 28 C100 52 80 70 50 92 Z')";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-envelope pb-14 pt-10 text-center">
      <p className="text-[0.65rem] tracking-[0.3em] text-cream/80">
        · SANG JIN &amp; HYO JEONG ·
      </p>
      <h1 className="font-display relative z-10 mt-2 -rotate-3 text-7xl leading-[0.8] tracking-wide text-primary">
        Our
        <br />
        Wedding
      </h1>

      <div className="relative mx-auto -mt-4 aspect-[100/92] w-[108%] max-w-none -translate-x-[3.7%]">
        <svg viewBox="0 0 100 92" className="absolute inset-0 size-full" aria-hidden>
          <path
            d="M50 92 C20 70 0 52 0 28 C0 12 12 0 27 0 C38 0 46 6 50 15 C54 6 62 0 73 0 C88 0 100 12 100 28 C100 52 80 70 50 92 Z"
            className="fill-cream"
          />
        </svg>
        <div className="absolute left-1/2 top-[20%] w-[46%] -translate-x-1/2 bg-cream p-1.5 shadow-lg">
          <span className="absolute -top-3 left-1/2 z-10 h-6 w-2 -translate-x-1/2 rounded-full border-2 border-envelope-shade" aria-hidden />
          {HERO_VIDEO_URL ? (
            <video src={HERO_VIDEO_URL} poster={heroImage} autoPlay muted loop playsInline className="no-zoom aspect-square w-full object-cover" />
          ) : (
            <img
              src={heroImage}
              alt={`${WEDDING.groom.name} 그리고 ${WEDDING.bride.name}`}
              className="no-zoom aspect-square w-full object-cover"
            />
          )}
        </div>
        <div className="absolute inset-x-0 top-[68%] text-paper-foreground">
          <p className="serif-title text-base font-semibold">
            {WEDDING.groom.name} — {WEDDING.bride.name}
          </p>
          <p className="mt-1 text-[0.7rem] opacity-75">2027. 03. 14 일요일 오후 1시</p>
          <p className="text-[0.7rem] opacity-75">
            {WEDDING.venue} {WEDDING.hall}
          </p>
        </div>
      </div>
    </section>
  );
}

export const HEART_CLIP = HEART;
