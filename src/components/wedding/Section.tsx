import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { useReveal } from "@/hooks/use-wedding";
import { cn } from "@/lib/utils";

export function StarDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8" aria-hidden>
      <span className="h-px w-12 bg-border" />
      <Star className="star-twinkle star-twinkle--first size-3 fill-primary text-primary" />
      <Star className="star-twinkle star-twinkle--middle size-2 fill-primary/60 text-primary/60" />
      <Star className="star-twinkle star-twinkle--last size-3 fill-primary text-primary" />
      <span className="h-px w-12 bg-border" />
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section id={id} ref={ref} data-visible={visible} className={cn("reveal px-6 py-4", className)}>
      {(eyebrow || title) && (
        <header className="mb-6 text-center">
          {eyebrow && (
            <p className="font-display text-[3.25rem] leading-none tracking-normal text-primary">
              {eyebrow}
            </p>
          )}
          {title && /[가-힣]/.test(title) && <h2 className="sr-only">{title}</h2>}
          {title && !/[가-힣]/.test(title) && (
            <h2 className="mt-2 font-sans text-sm font-medium tracking-wide text-foreground/85">
              {title}
            </h2>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
