import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SIDES = ["신랑측", "신부측"] as const;
const ATTEND = ["참석", "불참석"] as const;
const MEALS = ["식사 예정", "식사 안함"] as const;

function Choice({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border border-border px-3 py-2 text-sm transition-colors",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-secondary/40 text-foreground hover:border-primary/60",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function RsvpForm({
  onDone,
  defaultName = "",
}: {
  onDone?: () => void;
  defaultName?: string;
}) {
  const [side, setSide] = useState<string>(SIDES[0]);
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<string>(ATTEND[0]);
  const [guestCount, setGuestCount] = useState("1");
  const [meal, setMeal] = useState<string>(MEALS[0]);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("성함을 입력해 주세요.");
      return;
    }
    setSaving(true);
    const attending = attendance === "참석";
    const { error } = await supabase.from("rsvp_submissions").insert({
      side,
      name: name.trim(),
      attendance,
      guest_count: attending ? Number(guestCount) || 1 : 0,
      meal_preference: attending ? meal : null,
    });
    setSaving(false);

    if (error) {
      toast.error("전달에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    toast.success("소중한 답변 감사합니다!");
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="rounded-xl bg-primary/15 p-3 text-center text-xs leading-relaxed text-foreground">
        식사 준비를 위해 여쭤봐요 🙂
        <br />
        간단히 알려주시면 정성껏 준비하겠습니다.
      </p>

      <div className="space-y-2">
        <Label>어느 쪽 하객이신가요?</Label>
        <Choice options={SIDES} value={side} onChange={setSide} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rsvp-name">성함</Label>
        <Input
          id="rsvp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성함을 입력해 주세요"
          maxLength={20}
        />
      </div>

      <div className="space-y-2">
        <Label>참석 여부</Label>
        <Choice options={ATTEND} value={attendance} onChange={setAttendance} />
      </div>

      {attendance === "참석" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="rsvp-count">본인 포함 인원</Label>
            <Input
              id="rsvp-count"
              inputMode="numeric"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="space-y-2">
            <Label>식사 여부</Label>
            <Choice options={MEALS} value={meal} onChange={setMeal} />
          </div>
        </>
      )}

      <Button type="submit" disabled={saving} className="w-full rounded-full">
        {saving ? "전달 중..." : "전달하기"}
      </Button>
    </form>
  );
}
