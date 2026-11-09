import { useEffect, useRef, useState } from "react";
import { Heart, Sparkle, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const STAR_TYPES = [
  { id: "star", label: "별", Icon: Star },
  { id: "sparkle", label: "반짝", Icon: Sparkle },
  { id: "sparkles", label: "쌍별", Icon: Sparkles },
  { id: "heart", label: "하트별", Icon: Heart },
] as const;

const STAR_COLORS = [
  "var(--guest-star-1)",
  "var(--guest-star-2)",
  "var(--guest-star-3)",
  "var(--guest-star-4)",
  "var(--guest-star-5)",
  "var(--guest-star-6)",
];

type GuestbookStar = {
  id: string;
  star_type: string;
  pos_x: number;
  pos_y: number;
  color_index: number;
};

async function fetchGuestbookStars() {
  const { data, error } = await supabase.rpc("get_guestbook_stars");
  if (error) throw error;
  return data ?? [];
}

function StarIcon({ type, color, className }: { type: string; color: string; className?: string }) {
  const Icon = STAR_TYPES.find((t) => t.id === type)?.Icon ?? Star;
  return (
    <Icon
      className={className}
      style={{ color, fill: color, filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );
}

export function Guestbook() {
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [starType, setStarType] = useState<string>("star");
  const [colorIndex, setColorIndex] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [stars, setStars] = useState<GuestbookStar[]>([]);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const skyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const loadStars = async (notify: boolean) => {
      try {
        const data = await fetchGuestbookStars();
        if (active) setStars(data);
      } catch (error) {
        console.error("[Guestbook] Failed to load stars", error);
        if (active && notify) toast.error("축하의 별을 불러오지 못했어요.");
      }
    };

    void loadStars(true);
    const interval = window.setInterval(() => void loadStars(false), 15_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  function placeStar(event: React.MouseEvent<HTMLDivElement>) {
    if (!composerOpen || sent) return;
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
    const newStar: GuestbookStar = {
      id: crypto.randomUUID(),
      star_type: starType,
      pos_x: pos.x,
      pos_y: pos.y,
      color_index: colorIndex,
    };
    setSaving(true);
    const { error } = await supabase.from("guestbook_messages").insert({
      author: author.trim(),
      content: message.trim(),
      color_index: colorIndex,
      star_type: starType,
      pos_x: pos.x,
      pos_y: pos.y,
    });
    setSaving(false);
    if (error) return void toast.error("전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    setSent(true);
    setStars((current) => [...current, newStar]);
    try {
      setStars(await fetchGuestbookStars());
    } catch (loadError) {
      console.error("[Guestbook] Star saved but refresh failed", loadError);
      toast.warning(
        "별은 저장되어 이 화면에 표시했어요. 다른 방문자와 공유하려면 Supabase 조회 권한 적용이 필요해요.",
      );
      return;
    }
    toast.success("신랑·신부에게 반짝이는 축하의 별이 전송되었습니다");
  }

  return (
    <Section eyebrow="Constellation" title="축하의 별 띄우기">
      <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
        밤하늘에 놓인 축하의 별을 감상해 주세요.
        <br />
        이름과 메시지는 신랑 · 신부에게만 전해집니다.
      </p>

      <div
        ref={skyRef}
        onClick={placeStar}
        role="img"
        aria-label={`축하의 별 ${stars.length}개가 빛나는 밤하늘`}
        className={cn(
          "guestbook-sky relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/15 bg-sky",
          composerOpen && !sent && "cursor-crosshair",
        )}
      >
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 twinkle"
            style={{ left: `${star.pos_x}%`, top: `${star.pos_y}%` }}
          >
            <StarIcon
              type={star.star_type}
              color={STAR_COLORS[star.color_index] ?? "var(--guest-star-1)"}
              className="size-7"
            />
          </span>
        ))}
        {pos && !sent && (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <StarIcon
              type={starType}
              color={STAR_COLORS[colorIndex] ?? "var(--guest-star-1)"}
              className="size-7"
            />
          </span>
        )}
        <span className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[0.7rem] text-white/75">
          {sent
            ? "우리의 밤하늘에 별이 함께 빛나요"
            : !composerOpen
              ? "별 보내기를 눌러 축하를 남겨주세요"
              : pos
                ? "자리를 골랐어요"
                : "밤하늘을 눌러 내 별 자리 고르기"}
        </span>
      </div>

      {!sent && !composerOpen && (
        <Button
          type="button"
          className="mt-4 w-full rounded-full"
          onClick={() => setComposerOpen(true)}
          aria-expanded={composerOpen}
          aria-controls="guestbook-composer"
        >
          별 보내기
        </Button>
      )}

      {!sent && composerOpen && (
        <form id="guestbook-composer" onSubmit={submit} className="soft-card mt-4 space-y-4 p-4">
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
                <StarIcon
                  type={type.id}
                  color={STAR_COLORS[colorIndex] ?? "var(--guest-star-1)"}
                  className="size-5"
                />
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
                className={cn(
                  "size-7 rounded-full border-2",
                  colorIndex === index ? "border-foreground" : "border-transparent",
                )}
                style={{ background: color }}
              />
            ))}
          </div>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름"
            maxLength={20}
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            maxLength={300}
            placeholder="축하 메시지 (선택)"
          />
          <Button type="submit" disabled={saving} className="w-full rounded-full">
            {saving ? "별 띄우는 중..." : "별 띄우기"}
          </Button>
        </form>
      )}
    </Section>
  );
}
