import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const SIDES = ["신랑측", "신부측"] as const;
const ATTEND = ["참석", "불참석"] as const;
const MEALS = ["예정", "안함", "미정"] as const;

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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2">
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

export function RsvpForm({ onDone }: { onDone?: () => void }) {
  const [side, setSide] = useState<string>(SIDES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<string>(ATTEND[0]);
  const [guestCount, setGuestCount] = useState("1");
  const [companion, setCompanion] = useState("");
  const [meal, setMeal] = useState<string>(MEALS[0]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("성함을 입력해 주세요.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("rsvp_submissions").insert({
      side,
      name: name.trim(),
      phone: phone.trim() || null,
      attendance,
      guest_count: Number(guestCount) || 1,
      companion: companion.trim() || null,
      meal_preference: meal,
      message: message.trim() || null,
    });
    setSaving(false);

    if (error) {
      toast.error("전달에 실패했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }
    toast.success("참석 의사가 전달되었습니다. 감사합니다!");
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label>구분</Label>
        <Choice options={SIDES} value={side} onChange={setSide} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rsvp-name">성함</Label>
        <Input
          id="rsvp-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성함을 입력해 주세요"
        />
      </div>

      <div className="space-y-2">
        <Label>참석 여부</Label>
        <Choice options={ATTEND} value={attendance} onChange={setAttendance} />
      </div>

      {attendance === "참석" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="rsvp-count">참석 인원</Label>
            <Input
              id="rsvp-count"
              inputMode="numeric"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value.replace(/\D/g, ""))}
              placeholder="본인 포함 총 참석인원"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rsvp-companion">동행인</Label>
            <Input
              id="rsvp-companion"
              value={companion}
              onChange={(e) => setCompanion(e.target.value)}
              placeholder="함께 오시는 분 성함"
            />
          </div>

          <div className="space-y-2">
            <Label>식사 여부</Label>
            <Choice options={MEALS} value={meal} onChange={setMeal} />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="rsvp-phone">연락처 (선택)</Label>
        <Input
          id="rsvp-phone"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-0000-0000"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rsvp-message">남기실 말씀 (선택)</Label>
        <Textarea
          id="rsvp-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          placeholder="신랑신부에게 전하고 싶은 말"
        />
      </div>

      <Button type="submit" disabled={saving} className="w-full rounded-full">
        {saving ? "전달 중..." : "참석 의사 전달하기"}
      </Button>
    </form>
  );
}
