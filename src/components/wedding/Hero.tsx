import { WEDDING } from "@/lib/wedding-data";
import { COVER_PHOTO } from "@/lib/wedding-photos";

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
    <section className="hero-invitation relative isolate min-h-[min(100svh,900px)] w-full overflow-hidden text-center">
      <div className="hero-name-label absolute inset-x-5 top-[0.5%] z-20 flex justify-between text-[0.82rem] font-bold tracking-[0.16em]">
        <span>SANGJIN</span>
        <span>HYOJEONG</span>
      </div>
      <h1 className="hero-script-title absolute inset-x-0 top-[8%] z-10 flex flex-col items-center">
        <span>Our</span>
        <span>Wedding</span>
        <span>Day</span>
      </h1>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="hero-heart absolute left-1/2 top-[25%] w-[142%] max-w-none -translate-x-1/2"
        aria-hidden
      >
        <defs>
          <path
            id="hero-heart-shape"
            d="M50 100 C38 89 0 58 0 29 C0 11 12 0 27 0 C38 0 46 7 50 18 C54 7 62 0 73 0 C88 0 100 11 100 29 C100 58 62 89 50 100 Z"
          />
        </defs>
        <use href="#hero-heart-shape" className="hero-heart-paper" />
      </svg>

      <div className="hero-photo absolute left-1/2 top-[40%] z-10 w-[min(60%,260px)] -translate-x-1/2">
        <PaperClip className="absolute -top-[14%] left-[68%] z-10 h-[22%] w-[8%] rotate-[6deg]" />
        <img
          src={COVER_PHOTO}
          alt="상진과 효정의 결혼 사진"
          width={768}
          height={1152}
          draggable={false}
          className="hero-photo-frame aspect-square w-full bg-white object-cover object-[center_78%]"
        />
      </div>

      <div className="hero-caption absolute inset-x-0 top-[74%] z-10 px-4">
        <p className="text-lg font-semibold tracking-[0.08em]">
          {WEDDING.groom.name} <span className="mx-2 font-light">—</span> {WEDDING.bride.name}
        </p>
        <p className="mt-2 text-xs tracking-wide">{WEDDING.dateLabel}</p>
        <p className="mt-1 text-xs">
          {WEDDING.venue} {WEDDING.hall}
        </p>
      </div>
    </section>
  );
}
