import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { useReveal } from "@/hooks/use-wedding";
import { cn } from "@/lib/utils";

export function StarDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8" aria-hidden>
      <span className="h-px w-12 bg-border" />
      <Star className="size-3 fill-primary text-primary" />
      <Star className="size-2 fill-primary/60 text-primary/60" />
      <Star className="size-3 fill-primary text-primary" />
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
    <section
      id={id}
      ref={ref}
      data-visible={visible}
      className={cn("reveal px-6 py-4", className)}
    >
      {(eyebrow || title) && (
        <header className="mb-6 text-center" aria-label={title}>
          {eyebrow && (
             <p className="font-display text-5xl leading-none tracking-normal text-primary">
              {eyebrow}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
