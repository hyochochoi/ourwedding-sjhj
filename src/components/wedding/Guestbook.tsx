import { useEffect, useRef, useState } from "react";
import { Sparkle, Sparkles, Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type StarRow = {
  id: string;
  star_type: string;
  pos_x: number;
  pos_y: number;
  color_index: number;
};

const STAR_TYPES = [
  { id: "star", label: "별", Icon: Star },
  { id: "sparkle", label: "반짝", Icon: Sparkle },
  { id: "sparkles", label: "쌍별", Icon: Sparkles },
  { id: "heart", label: "하트별", Icon: Heart },
] as const;

const STAR_COLORS = [
  "var(--star-1)",
  "var(--star-2)",
  "var(--star-3)",
  "var(--star-4)",
  "var(--star-5)",
  "var(--star-6)",
];

function StarIcon({
  type,
  color,
  className,
}: {
  type: string;
  color: string;
  className?: string;
}) {
  const Icon = STAR_TYPES.find((t) => t.id === type)?.Icon ?? Star;
  return (
    <Icon
      className={className}
      style={{ color, fill: color, filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
}

export function Guestbook() {
  const [stars, setStars] = useState<StarRow[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [starType, setStarType] = useState<string>("star");
  const [colorIndex, setColorIndex] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const skyRef = useRef<HTMLDivElement>(null);

  async function load() {
    const { data } = await supabase.rpc("get_guestbook_stars");
    if (data) setStars(data as StarRow[]);
  }

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 30000);
    return () => window.clearInterval(timer);
  }, []);

  function placeStar(event: React.MouseEvent<HTMLDivElement>) {
    const rect = skyRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPos({
      x: Math.min(96, Math.max(4, x)),
      y: Math.min(94, Math.max(6, y)),
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!author.trim() || !content.trim()) {
      toast.error("이름과 메시지를 모두 입력해 주세요.");
      return;
    }
    if (!pos) {
      toast.error("밤하늘을 눌러 별을 놓을 자리를 골라주세요.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("guestbook_messages").insert({
      author: author.trim(),
      content: content.trim(),
      color_index: colorIndex,
      star_type: starType,
      pos_x: pos.x,
      pos_y: pos.y,
    });
    setSaving(false);

    if (error) {
      toast.error("등록에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setContent("");
    setPos(null);
    toast.success("마음이 전해졌어요. 별 하나가 떴습니다 ✨");
    void load();
  }

  return (
    <Section eyebrow="Guestbook" title="축하의 별 띄우기">
      <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
        남겨주신 메시지는 신랑 · 신부만 읽을 수 있어요.
        <br />
        대신 밤하늘에 여러분의 별이 하나씩 뜹니다.
      </p>

      <div
        ref={skyRef}
        onClick={placeStar}
        className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-3xl border border-border bg-sky"
      >
        {stars.map((star, index) => (
          <span
            key={star.id}
            className="twinkle absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${star.pos_x}%`,
              top: `${star.pos_y}%`,
              animationDelay: `${(index % 7) * 0.4}s`,
            }}
          >
            <StarIcon
              type={star.star_type}
              color={STAR_COLORS[star.color_index % 6]}
              className="size-4"
            />
          </span>
        ))}
        {pos && (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <StarIcon
              type={starType}
              color={STAR_COLORS[colorIndex]}
              className="size-6"
            />
          </span>
        )}
        <span className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[0.7rem] text-muted-foreground">
          {stars.length}개의 별 · {pos ? "자리를 골랐어요" : "눌러서 내 별 자리 고르기"}
        </span>
      </div>

      <form onSubmit={submit} className="soft-card mt-4 space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">별 모양</p>
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
                <StarIcon type={type.id} color={STAR_COLORS[colorIndex]} className="size-5" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">별 색깔</p>
          <div className="flex gap-2">
            {STAR_COLORS.map((color, index) => (
              <button
                key={color}
                type="button"
                aria-label={`색 ${index + 1}`}
                onClick={() => setColorIndex(index)}
                className={cn(
                  "size-7 rounded-full border-2",
                  colorIndex === index ? "border-foreground" : "border-transparent",
                )}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          maxLength={20}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="신랑 · 신부에게만 전해지는 축하 메시지"
          rows={3}
          maxLength={500}
        />
        <Button type="submit" disabled={saving} className="w-full rounded-full">
          {saving ? "별 띄우는 중..." : "별 띄우기"}
        </Button>
      </form>
    </Section>
  );
}
