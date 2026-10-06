import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ATTEND = ["참석", "불참"] as const;

export function RsvpForm({
  onDone,
  defaultName = "",
}: {
  onDone?: () => void;
  defaultName?: string;
}) {
  const [name, setName] = useState(defaultName);
  const [attendance, setAttendance] = useState<string>(ATTEND[0]);
  const [companions, setCompanions] = useState("0");
  const [phone, setPhone] = useState("");
  const [reminder, setReminder] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return void toast.error("성함을 입력해 주세요.");
    if (reminder && !phone.trim()) return void toast.error("리마인드를 받으실 연락처를 입력해 주세요.");
    setSaving(true);
    const attending = attendance === "참석";
    const { error } = await supabase.from("rsvp_submissions").insert({
      side: "미지정",
      name: name.trim(),
      phone: reminder ? phone.trim() : null,
      attendance,
      guest_count: attending ? 1 + (Number(companions) || 0) : 0,
      reminder_consent: reminder,
    });
    setSaving(false);
    if (error) return void toast.error("전달에 실패했어요. 잠시 후 다시 시도해 주세요.");
    toast.success("소중한 답변 감사합니다 🌿");
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
        <Label htmlFor="rsvp-name">성함</Label>
        <Input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder="성함" />
      </div>

      <div className="space-y-2">
        <Label>참석 여부</Label>
        <div className="grid grid-cols-2 gap-2">
          {ATTEND.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAttendance(option)}
              className={cn(
                "rounded-full border border-border px-3 py-2 text-sm transition-colors",
                attendance === option ? "border-primary bg-primary text-primary-foreground" : "bg-secondary/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {attendance === "참석" && (
        <div className="space-y-2">
          <Label htmlFor="rsvp-companions">동행인 수 (본인 제외)</Label>
          <Input
            id="rsvp-companions"
            inputMode="numeric"
            value={companions}
            onChange={(e) => setCompanions(e.target.value.replace(/\D/g, "").slice(0, 2))}
          />
        </div>
      )}

      <label className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={reminder}
          onChange={(e) => setReminder(e.target.checked)}
          className="mt-0.5 size-4 accent-[var(--primary)]"
        />
        예식 일주일 전(3월 7일), 예식 안내 리마인드 메시지를 받을게요.
      </label>

      {reminder && (
      <div className="animate-in fade-in space-y-2">
        <Label htmlFor="rsvp-phone">연락처</Label>
        <Input id="rsvp-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
      </div>

      )}

      <Button type="submit" disabled={saving} className="w-full rounded-full">
        {saving ? "전달 중..." : "전달하기"}
      </Button>
    </form>
  );
}
