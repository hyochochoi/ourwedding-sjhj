import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rsvpSchema } from "@/lib/wedding-rules";
import { submitRsvp } from "@/lib/rsvp.functions";

export function RsvpForm({ onDone, onCancel, defaultName = "" }: { onDone?: () => void; onCancel?: () => void; defaultName?: string }) {
 const [name, setName] = useState(defaultName);
 const [side, setSide] = useState<"신랑" | "신부">("신부");
 const [attendance, setAttendance] = useState<"참석" | "불참">("참석");
 const [people, setPeople] = useState("1");
 const [remind, setRemind] = useState(false);
 const [phone, setPhone] = useState("");
 const [saving, setSaving] = useState(false);
 const send = useServerFn(submitRsvp);
 async function submit(event: React.FormEvent) {
  event.preventDefault();
  const result = rsvpSchema.safeParse({ name, side, attendance, guest_count: Number(people), reminder_consent: remind, phone: remind ? phone : undefined });
  if (!result.success) return void toast.error(result.error.issues[0]?.message ?? "입력 내용을 확인해 주세요.");
  setSaving(true);
  try { await send({ data: result.data }); toast.success("소중한 답변 감사합니다"); onDone?.(); }
  catch (e) { toast.error(e instanceof Error ? e.message : "전달하지 못했어요."); }
  finally { setSaving(false); }
 }
 return <form onSubmit={submit} className="space-y-4">
  <p className="text-center text-xs leading-relaxed text-muted-foreground">식사 준비를 위해 여쭤봐요.<br />알려주시면 정성껏 준비하겠습니다.</p>
  <div className="grid grid-cols-2 gap-2" aria-label="신랑 또는 신부 측">
   {(["신랑", "신부"] as const).map(value => <Button key={value} type="button" variant={side === value ? "default" : "secondary"} aria-pressed={side === value} onClick={() => setSide(value)}>{value} 측</Button>)}
  </div>
  <div className="space-y-2"><Label htmlFor="rsvp-name">성함</Label><Input id="rsvp-name" value={name} onChange={e => setName(e.target.value)} maxLength={20} placeholder="성함" required /></div>
  <div className="space-y-2"><Label>참석 여부</Label><div className="grid grid-cols-2 gap-2">{(["참석","불참"] as const).map(value => <Button key={value} type="button" variant={attendance === value ? "default" : "secondary"} aria-pressed={attendance === value} onClick={() => setAttendance(value)}>{value}</Button>)}</div></div>
  {attendance === "참석" && <div className="space-y-2"><Label htmlFor="rsvp-people">인원 (본인 포함)</Label><Input id="rsvp-people" type="number" min={1} max={100} value={people} onChange={e => setPeople(e.target.value)} required /></div>}
  <label className="flex items-start gap-2 text-xs leading-relaxed"><input type="checkbox" className="mt-0.5 accent-primary" checked={remind} onChange={e => setRemind(e.target.checked)} />예식 일주일 전에 안내 연락을 받을게요</label>
  {remind && <div className="space-y-2"><Label htmlFor="rsvp-phone">전화번호</Label><Input id="rsvp-phone" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} maxLength={13} placeholder="010-0000-0000" /></div>}
  <div className="grid grid-cols-2 gap-2"><Button type="submit" disabled={saving}>{saving ? "전달 중…" : "전달하기"}</Button><Button type="button" variant="secondary" disabled={saving} onClick={() => { setName(defaultName); setPeople("1"); setRemind(false); setPhone(""); onCancel?.(); }}>취소</Button></div>
 </form>;
}
