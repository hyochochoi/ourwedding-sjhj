import { Section } from "@/components/wedding/Section";
import { WEDDING_PHOTOS as PHOTOS } from "@/lib/wedding-photos";

export function Gallery() {
  return (
    <Section eyebrow="Gallery" title="우리의 순간">
      <div
        className="grid grid-cols-3 gap-1.5"
        onContextMenu={(e) => e.preventDefault()}
      >
        {Array.from({ length: 18 }, (_, i) => PHOTOS[i % PHOTOS.length]).map((photo, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-lg border border-border"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              width={1024}
              height={1280}
              draggable={false}
              className="no-zoom aspect-square w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </Section>
  );
}
