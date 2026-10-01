import { Section } from "@/components/wedding/Section";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";

const PHOTOS = [
  { src: g1, alt: "함께 걷는 신랑 신부" },
  { src: g2, alt: "웃고 있는 신랑 신부" },
  { src: g3, alt: "노을 지는 들판의 신랑 신부" },
];

export function Gallery() {
  return (
    <Section eyebrow="Gallery" title="우리의 순간">
      <div
        className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onContextMenu={(e) => e.preventDefault()}
      >
        {PHOTOS.map((photo) => (
          <figure
            key={photo.alt}
            className="w-[76%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              width={1024}
              height={1280}
              draggable={false}
              className="no-zoom aspect-[4/5] w-full object-cover"
            />
          </figure>
        ))}
      </div>
      <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
        사진은 확대 · 저장이 제한되어 있습니다
      </p>
    </Section>
  );
}
