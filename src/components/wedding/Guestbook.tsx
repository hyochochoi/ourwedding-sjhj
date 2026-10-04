import { useRef, useState } from "react";
import { Heart, Sparkle, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const STAR_TYPES = [
  { id: "star", label: "별", Icon: Star },
  { id: "sparkle", label: "반짝", Icon: Sparkle },
  { id: "sparkles", label: "쌍별", Icon: Sparkles },
  { id: "heart", label: "하트별", Icon: Heart },
] as const;

const STAR_COLORS = ["var(--star-1)", "var(--star-2)", "var(--star-3)", "var(--star-4)", "var(--star-5)", "var(--star-6)"];

function StarIcon({ type, color, className }: { type: string; color: string; className?: string }) {
  const Icon = STAR_TYPES.find((t) => t.id === type)?.Icon ?? Star;
  return <Icon className={className} style={{ color, fill: color, filter: `drop-shadow(0 0 6px ${color})` }} />;
}

export function Guestbook() {
  const [author, setAuthor] = useState("");
  const [starType, setStarType] = useState<string>("star");
  const [colorIndex, setColorIndex] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const skyRef = useRef<HTMLDivElement>(null);

  function placeStar(event: React.MouseEvent<HTMLDivElement>) {
    if (sent) return;
    const rect = skyRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.min(96, Math.max(4, x)), y: Math.min(94, Math.max(6, y)) });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim()) return void toast.error("이름을 입력해 주세요.");
    if (!pos) return void toast.error("밤하늘을 눌러 별을 놓을 자리를 골라주세요.");
    setSaving(true);
    const { error } = await supabase.from("guestbook_messages").insert({
      author: author.trim(),
      content: "",
      color_index: colorIndex,
      star_type: starType,
      pos_x: pos.x,
      pos_y: pos.y,
    });
    setSaving(false);
    if (error) return void toast.error("전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    setSent(true);
    toast.success("신랑·신부에게 반짝이는 축하의 별이 전송되었습니다 ✨");
  }

  return (
    <Section eyebrow="Guestbook" title="축하의 별 띄우기">
      <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
        이름을 적고 밤하늘에 축하의 별을 띄워주세요.
        <br />
        별은 신랑 · 신부에게만 전해집니다.
      </p>

      <div
        ref={skyRef}
        onClick={placeStar}
        className="relative aspect-[4/3] w-full cursor-crosshair overflow-hidden rounded-3xl border border-border bg-sky"
      >
        {pos && (
          <span
            className={cn("absolute -translate-x-1/2 -translate-y-1/2", sent ? "twinkle" : "animate-pulse")}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <StarIcon type={starType} color={STAR_COLORS[colorIndex] ?? "var(--star-1)"} className="size-7" />
          </span>
        )}
        <span className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[0.7rem] text-muted-foreground">
          {sent ? "별이 하늘로 올라갔어요 ✨" : pos ? "자리를 골랐어요" : "눌러서 내 별 자리 고르기"}
        </span>
      </div>

      {!sent && (
        <form onSubmit={submit} className="soft-card mt-4 space-y-4 p-4">
          <div className="grid grid-cols-4 gap-2">
            {STAR_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setStarType(type.id)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border border-border py-2 text-[0.7rem]",
                  starType === type.id ? "border-primary bg-primary/15" : "bg-secondary/30",
                )}
              >
                <StarIcon type={type.id} color={STAR_COLORS[colorIndex] ?? "var(--star-1)"} className="size-5" />
                {type.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {STAR_COLORS.map((color, index) => (
              <button
                key={color}
                type="button"
                aria-label={`색 ${index + 1}`}
                onClick={() => setColorIndex(index)}
                className={cn("size-7 rounded-full border-2", colorIndex === index ? "border-foreground" : "border-transparent")}
                style={{ background: color }}
              />
            ))}
          </div>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름" maxLength={20} />
          <Button type="submit" disabled={saving} className="w-full rounded-full">
            {saving ? "별 띄우는 중..." : "별 띄우기"}
          </Button>
        </form>
      )}
    </Section>
  );
}
