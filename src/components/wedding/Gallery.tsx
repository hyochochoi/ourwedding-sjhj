import { Section } from "@/components/wedding/Section";
import { WEDDING_PHOTOS as PHOTOS } from "@/lib/wedding-photos";

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
    </Section>
  );
}
