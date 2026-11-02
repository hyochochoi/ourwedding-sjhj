import { ChevronDown } from "lucide-react";
import { COVER_PHOTO as heroImage } from "@/lib/wedding-photos";
import { HERO_VIDEO_URL, WEDDING } from "@/lib/wedding-data";

export function Hero() {
  return (
    <section className="relative h-[92svh] min-h-[560px] w-full overflow-hidden">
      {HERO_VIDEO_URL ? (
        <video
          src={HERO_VIDEO_URL}
          poster={heroImage}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="no-zoom absolute inset-0 size-full object-cover"
        />
      ) : (
        <img
          src={heroImage}
          alt={`${WEDDING.groom.name} 그리고 ${WEDDING.bride.name}`}
          width={1024}
          height={1536}
          className="no-zoom absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-0 cover-shade" />

      <h1 className="font-display absolute inset-x-0 top-[9%] z-10 -rotate-3 text-center text-7xl leading-none tracking-[0.02em] text-primary drop-shadow-[0_4px_0_var(--envelope-shade)]">
        Our Wedding
      </h1>
      <div className="relative flex h-full flex-col items-center justify-end px-6 pb-10 text-center">
        <p className="mt-5 text-sm tracking-normal text-cream">2027.03.14 SUN 13:00 PM</p>
        <p className="serif-title mt-3 text-lg text-cream">
          {WEDDING.groom.name} <span className="text-primary">·</span> {WEDDING.bride.name}
        </p>
        <p className="serif-title mt-1 text-xs tracking-normal text-cream/85">
          {WEDDING.venue} {WEDDING.hall}
        </p>
        <div className="bounce-hint mt-8 flex flex-col items-center gap-1 text-primary">
          <span className="text-[0.65rem] tracking-normal">SCROLL</span>
          <ChevronDown className="size-5" />
        </div>
      </div>
    </section>
  );
}
