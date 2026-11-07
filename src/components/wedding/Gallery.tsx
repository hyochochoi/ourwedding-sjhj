import { useState } from "react";
import { Section } from "@/components/wedding/Section";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WEDDING_PHOTOS as PHOTOS } from "@/lib/wedding-photos";

export function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof PHOTOS)[number] | null>(null);

  return (
    <Section eyebrow="Gallery" title="우리의 순간">
      <div className="grid grid-cols-3 gap-1.5" onContextMenu={(e) => e.preventDefault()}>
        {PHOTOS.map((photo, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              className="block w-full cursor-pointer"
              aria-label={`${photo.alt} 크게 보기`}
              onClick={() => setSelectedPhoto(photo)}
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
            </button>
          </figure>
        ))}
      </div>
      <Dialog
        open={selectedPhoto !== null}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent
          className="w-[calc(100%-1rem)] max-w-[900px] border-0 bg-transparent p-2 shadow-none sm:rounded-none"
          onContextMenu={(event) => event.preventDefault()}
        >
          <DialogTitle className="sr-only">웨딩 사진 크게 보기</DialogTitle>
          <DialogDescription className="sr-only">{selectedPhoto?.alt ?? ""}</DialogDescription>
          {selectedPhoto && (
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              draggable={false}
              className="no-zoom touch-none mx-auto max-h-[88svh] w-auto max-w-full select-none object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
