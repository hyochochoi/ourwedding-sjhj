import { useRef, useState, type TouchEvent } from "react";
import { Section } from "@/components/wedding/Section";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { WEDDING_PHOTOS as PHOTOS } from "@/lib/wedding-photos";

export function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const selectedPhoto = selectedIndex === null ? null : PHOTOS[selectedIndex];

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches.item(0)?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null || selectedIndex === null) return;

    const touch = event.changedTouches.item(0);
    if (!touch) return;

    const delta = touch.clientX - startX;
    if (Math.abs(delta) < 48) return;

    setSelectedIndex((index) =>
      index === null
        ? null
        : Math.min(PHOTOS.length - 1, Math.max(0, index + (delta < 0 ? 1 : -1))),
    );
  }

  return (
    <Section eyebrow="Gallery" title="우리의 순간">
      <div className="grid grid-cols-3 gap-1.5" onContextMenu={(e) => e.preventDefault()}>
        {PHOTOS.map((photo, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              className="block w-full cursor-pointer"
              aria-label={`${photo.alt} 크게 보기`}
              onClick={() => setSelectedIndex(i)}
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
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          className="w-[calc(100%-1rem)] max-w-[900px] border-0 bg-transparent p-2 shadow-none sm:rounded-none"
          onContextMenu={(event) => event.preventDefault()}
        >
          <DialogTitle className="sr-only">웨딩 사진 크게 보기</DialogTitle>
          <DialogDescription className="sr-only">{selectedPhoto?.alt ?? ""}</DialogDescription>
          {selectedPhoto && (
            <div
              className="flex touch-pan-y justify-center"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => {
                touchStartX.current = null;
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  setSelectedIndex((index) =>
                    index === null ? null : Math.min(PHOTOS.length - 1, index + 1),
                  );
                } else if (event.key === "ArrowLeft") {
                  setSelectedIndex((index) => (index === null ? null : Math.max(0, index - 1)));
                }
              }}
              tabIndex={0}
              aria-label="사진을 좌우로 넘겨 볼 수 있습니다"
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                draggable={false}
                className="no-zoom touch-none max-h-[88svh] w-auto max-w-full select-none object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
