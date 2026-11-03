import { COVER_PHOTO as heroImage } from "@/lib/wedding-photos";
import { HERO_VIDEO_URL, WEDDING } from "@/lib/wedding-data";

export function Hero() {
  return (
    <section className="cover-paper relative w-full overflow-hidden bg-envelope pb-5 pt-8 text-center">
      <p className="text-[0.65rem] text-cream/80">
        · SANG JIN &amp; HYO JEONG ·
      </p>
      <h1 className="font-cover relative z-10 mt-8 -rotate-6 text-[6rem] font-normal leading-[0.78] text-cream">
        Our
        <br />
        Wedding
      </h1>

      <div className="relative mx-auto -mt-2 aspect-[100/110] w-full">
        <svg viewBox="0 0 100 110" className="absolute inset-0 size-full" aria-hidden>
          <path
            d="M50 110 C30 90 0 66 0 36 C0 14 10 0 26 0 C38 0 46 9 50 22 C54 9 62 0 74 0 C90 0 100 14 100 36 C100 66 70 90 50 110 Z"
            className="fill-cream"
          />
        </svg>
        <div className="absolute left-1/2 top-[24%] w-[50%] -translate-x-1/2">
          <span className="paper-clip absolute -top-8 left-[62%] z-10" aria-hidden />
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
        <div className="absolute inset-x-0 top-[72%] text-paper-foreground">
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
