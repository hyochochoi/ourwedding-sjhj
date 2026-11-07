import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { rsvpSummary, inviteSlugSchema } from "@/lib/wedding-rules";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createInvitee,
  deleteGuestbookStar,
  deleteInvitee,
  getAdminData,
  getGuestPhotos,
  resetRsvps,
  resetGuestbook,
  resetGuestPhotos,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "신랑·신부 관리 | 이상진 · 최효정 결혼식" },
      { name: "description", content: "참석 여부, 축하의 별, 초대 링크, 하객 사진을 관리합니다." },
      { property: "og:title", content: "신랑·신부 관리" },
      {
        property: "og:description",
        content: "참석 여부, 축하의 별, 초대 링크, 하객 사진을 관리합니다.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type AdminData = Awaited<ReturnType<typeof getAdminData>>;
type Photo = { name: string; downloadUrl: string; previewUrl: string; category?: string };

const STAR_COLORS = [
  "var(--star-1)",
  "var(--star-2)",
  "var(--star-3)",
  "var(--star-4)",
  "var(--star-5)",
  "var(--star-6)",
];

function AdminPage() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchData = useServerFn(getAdminData);
  const resetResponses = useServerFn(resetRsvps);
  const clearGuestbook = useServerFn(resetGuestbook);
  const removeGuestbookStar = useServerFn(deleteGuestbookStar);

  async function login(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    try {
      setData(await fetchData({ data: { code } }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "불러오기에 실패했어요.");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <form
        onSubmit={login}
        className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center gap-3 px-6"
      >
        <h1 className="serif-title text-center text-lg">신랑 · 신부 관리</h1>
        <Input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="관리자 코드"
        />
        <Button type="submit" disabled={loading || !code} className="rounded-full">
          {loading ? "확인 중..." : "들어가기"}
        </Button>
      </form>
    );
  }

  const attending = data.rsvps.filter((r) => r.attendance === "참석");
  const people = attending.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  return (
    <div className="mx-auto min-h-screen w-full max-w-[640px] px-4 py-8">
      <h1 className="serif-title text-lg">신랑 · 신부 관리</h1>
      <Tabs defaultValue="rsvp" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rsvp">참석</TabsTrigger>
          <TabsTrigger value="stars">별</TabsTrigger>
          <TabsTrigger value="links">링크</TabsTrigger>
          <TabsTrigger value="photos">사진·영상</TabsTrigger>
        </TabsList>

        <TabsContent value="rsvp" className="space-y-3 pt-4">
          <p className="text-sm">
            응답 {data.rsvps.length}건 · 참석 {attending.length}건 · 총 {people}명 · 리마인드 동의{" "}
            {data.rsvps.filter((r) => r.reminder_consent).length}명
          </p>
          <ResetControl
            label="응답 내역 초기화"
            onReset={async (confirmation) => {
              await resetResponses({ data: { code, confirmation } });
              await login();
            }}
          />
          <MealEstimateCharts rsvps={data.rsvps} />
          <div className="grid gap-4 sm:grid-cols-2">
            {["신부", "신랑"].map((side) => (
              <RsvpChart key={side} side={side} rsvps={data.rsvps.filter((r) => r.side === side)} />
            ))}
          </div>
          {data.rsvps.some((r) => r.side !== "신랑" && r.side !== "신부") && (
            <p className="text-xs text-muted-foreground">
              기존 미지정 응답{" "}
              {data.rsvps.filter((r) => r.side !== "신랑" && r.side !== "신부").length}건
            </p>
          )}
          {["신부", "신랑"].map((side) => {
            const sideRsvps = data.rsvps.filter((r) => r.side === side);
            return (
              <section key={side} className="space-y-2">
                <h2 className="text-sm font-semibold">{side} 측 상세 응답</h2>
                {sideRsvps.length === 0 ? (
                  <p className="text-xs text-muted-foreground">아직 응답이 없습니다.</p>
                ) : (
                  sideRsvps.map((r) => (
                    <div key={r.id} className="soft-card p-3 text-xs">
                      <p className="text-sm">{r.name}</p>
                      <p className="mt-1 text-muted-foreground">
                        {r.attendance} · {r.guest_count}명 {r.phone ? `· ${r.phone}` : ""}{" "}
                        {r.reminder_consent ? "· 리마인드 동의" : ""}
                      </p>
                    </div>
                  ))
                )}
              </section>
            );
          })}
          {data.rsvps.some((r) => r.side !== "신랑" && r.side !== "신부") && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold">기존 미지정 상세 응답</h2>
              {data.rsvps
                .filter((r) => r.side !== "신랑" && r.side !== "신부")
                .map((r) => (
                  <div key={r.id} className="soft-card p-3 text-xs">
                    <p className="text-sm">{r.name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {r.attendance} · {r.guest_count}명 {r.phone ? `· ${r.phone}` : ""}{" "}
                      {r.reminder_consent ? "· 리마인드 동의" : ""}
                    </p>
                  </div>
                ))}
            </section>
          )}
        </TabsContent>

        <TabsContent value="stars" className="space-y-3 pt-4">
          <ResetControl
            label="축하 별 초기화"
            onReset={async (confirmation) => {
              await clearGuestbook({ data: { code, confirmation } });
              await login();
            }}
          />
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-sky">
            {data.guestbook.map((s) => (
              <span
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${s.pos_x}%`, top: `${s.pos_y}%` }}
              >
                <Star
                  className="mx-auto size-4"
                  style={{
                    color: STAR_COLORS[s.color_index % 6],
                    fill: STAR_COLORS[s.color_index % 6],
                  }}
                />
                <span className="text-[0.6rem] whitespace-nowrap text-foreground/80">
                  {s.author}
                </span>
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">밤하늘에 놓인 축하 별을 관리합니다.</p>
          <div className="space-y-2">
            {data.guestbook.map((s) => (
              <div key={s.id} className="soft-card flex items-start gap-2 p-3 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <Star
                      className="mr-1 inline size-3"
                      style={{
                        color: STAR_COLORS[s.color_index % 6],
                        fill: STAR_COLORS[s.color_index % 6],
                      }}
                    />
                    {s.author}
                    <span className="ml-2 text-[0.65rem] text-muted-foreground">
                      {new Date(s.created_at).toLocaleString("ko-KR")}
                    </span>
                  </p>
                  {s.content && (
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{s.content}</p>
                  )}
                </div>
                <DeleteGuestbookStarButton
                  onDelete={async () => {
                    await removeGuestbookStar({ data: { code, id: s.id } });
                    await login();
                  }}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="links" className="pt-4">
          <InviteeManager code={code} invitees={data.invitees} onChange={() => void login()} />
        </TabsContent>

        <TabsContent value="photos" className="pt-4">
          <PhotoManager code={code} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InviteeManager({
  code,
  invitees,
  onChange,
}: {
  code: string;
  invitees: AdminData["invitees"];
  onChange: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const create = useServerFn(createInvitee);
  const remove = useServerFn(deleteInvitee);
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const parsed = inviteSlugSchema.safeParse(slug);
    if (!parsed.success)
      return void toast.error("영문 이름은 영어 소문자, 숫자, 하이픈으로 입력해 주세요.");
    try {
      const res = await create({ data: { code, name, slug: parsed.data } });
      await navigator.clipboard.writeText(`${origin}/to-${res.code}`).catch(() => undefined);
      toast.success(`${name}님 링크를 만들고 복사했어요`);
      setName("");
      setSlug("");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "생성 실패");
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={add} className="grid gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="받는 분 이름 (예: 김민지)"
        />
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          maxLength={40}
          placeholder="영문 이름 (예: hyojeong)"
          aria-label="영문 이름"
        />
        <Button type="submit" className="shrink-0 rounded-full">
          만들기
        </Button>
      </form>
      {invitees.map((inv) => {
        const url = `${origin}/to-${inv.code}`;
        return (
          <div key={inv.id} className="soft-card flex items-center gap-2 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm">To. {inv.name}</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">{url}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="복사"
              onClick={() => {
                void navigator.clipboard.writeText(url);
                toast.success("링크가 복사되었습니다");
              }}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              aria-label="삭제"
              onClick={async () => {
                await remove({ data: { code, id: inv.id } });
                onChange();
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function ResetControl({
  label,
  onReset,
}: {
  label: string;
  onReset: (confirmation: "초기화") => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setText("");
          setOpen(true);
        }}
      >
        <Trash2 className="size-4" />
        {label}
      </Button>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            모든 내역이 영구 삭제됩니다. 되돌릴 수 없습니다.
          </p>
          <Input
            aria-label="초기화 확인"
            placeholder="초기화 입력"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={busy}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={busy} onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={busy || text !== "초기화"}
              onClick={async () => {
                setBusy(true);
                try {
                  await onReset("초기화");
                  setOpen(false);
                  toast.success("초기화되었습니다");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "삭제 실패");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "삭제 중…" : "삭제 확정"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DeleteGuestbookStarButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="별 삭제" onClick={() => setOpen(true)}>
        <Trash2 className="size-4" />
      </Button>
      <Dialog open={open} onOpenChange={(value) => !busy && setOpen(value)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>축하 별 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            이 별과 축하 메시지를 삭제할까요? 삭제 후 청첩장 밤하늘에서도 사라집니다.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" disabled={busy} onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await onDelete();
                  setOpen(false);
                  toast.success("축하 별을 삭제했습니다.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "별 삭제에 실패했어요.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "삭제 중..." : "삭제"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PhotoManager({ code }: { code: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const fetchPhotos = useServerFn(getGuestPhotos);
  const reset = useServerFn(resetGuestPhotos);
  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetchPhotos({ data: { code, offset: photos.length } });
      setPhotos((p) => [...p, ...res.photos]);
      setHasMore(res.hasMore);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }
  async function downloadSelected() {
    setDownloading(true);
    try {
      for (const photo of photos.filter((p) => selected.has(p.name))) {
        const response = await fetch(photo.downloadUrl);
        if (!response.ok) throw new Error("다운로드 실패");
        const url = URL.createObjectURL(await response.blob());
        const a = document.createElement("a");
        a.href = url;
        a.download = photo.name;
        document.body.append(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
      toast.success("선택한 파일을 저장했습니다");
    } catch {
      toast.error(
        "일부 파일을 저장하지 못했어요. 브라우저의 여러 파일 다운로드 허용을 확인해 주세요.",
      );
    } finally {
      setDownloading(false);
    }
  }
  const video = (name: string) => /\.(mp4|mov|m4v|webm|avi|mkv|3gp|hevc)$/i.test(name);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" disabled={loading || !hasMore} onClick={loadMore}>
          {loading ? "불러오는 중…" : photos.length ? "더 불러오기" : "사진·영상 불러오기"}
        </Button>
        <Button disabled={!selected.size || downloading} onClick={downloadSelected}>
          <Download className="size-4" />
          선택 {selected.size}개 받기
        </Button>
        <ResetControl
          label="사진·영상 초기화"
          onReset={async (confirmation) => {
            let more = true;
            while (more) {
              const res = await reset({ data: { code, confirmation } });
              more = res.hasMore;
            }
            setPhotos([]);
            setSelected(new Set());
            setHasMore(true);
            setPreview(null);
          }}
        />
      </div>
      {photos.length > 0 && (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selected.size === photos.length}
            onCheckedChange={(checked) =>
              setSelected(checked ? new Set(photos.map((p) => p.name)) : new Set())
            }
          />
          불러온 {photos.length}개 전체 선택
        </label>
      )}
      {!loading && !hasMore && !photos.length && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          아직 전달된 사진·영상이 없습니다.
        </p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.name} className="relative overflow-hidden rounded-lg bg-secondary">
            <Button
              variant="ghost"
              className="h-auto w-full p-0"
              aria-label={`미리보기 ${photo.name}`}
              onClick={() => setPreview(photo)}
            >
              {video(photo.name) ? (
                <video
                  src={photo.previewUrl}
                  preload="metadata"
                  muted
                  playsInline
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <img
                  src={photo.previewUrl}
                  alt={photo.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              )}
            </Button>
            <div className="flex items-center justify-between gap-1 p-2">
              <Checkbox
                aria-label={`선택 ${photo.name}`}
                checked={selected.has(photo.name)}
                onCheckedChange={(checked) =>
                  setSelected((previous) => {
                    const next = new Set(previous);
                    if (checked) next.add(photo.name);
                    else next.delete(photo.name);
                    return next;
                  })
                }
              />
              <span className="truncate text-[0.65rem]">{photo.category}</span>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="break-all text-sm">사진·영상 미리보기</DialogTitle>
          </DialogHeader>
          {preview &&
            (video(preview.name) ? (
              <video
                src={preview.previewUrl}
                controls
                playsInline
                className="max-h-[70svh] w-full"
              />
            ) : (
              <img
                src={preview.previewUrl}
                alt="하객 사진"
                className="max-h-[70svh] w-full object-contain"
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary/50">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${max ? (value / max) * 100 : 0}%` }}
        />
      </div>
      <span className="w-10 text-right tabular-nums">{value}</span>
    </div>
  );
}

function MealEstimateCharts({ rsvps }: { rsvps: AdminData["rsvps"] }) {
  const sides = ["신랑", "신부"].map((side) => ({
    side,
    people: rsvpSummary(rsvps.filter((r) => r.side === side)).people,
  }));
  const max = Math.max(...sides.map(({ people }) => people), 1);
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold">최종 식사 예상 인원</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {sides.map(({ side, people }) => (
          <div key={side} className="soft-card space-y-3 p-4">
            <h3 className="text-sm font-medium">{side} 측</h3>
            <Bar label="식사 인원" value={people} max={max} />
          </div>
        ))}
      </div>
    </section>
  );
}

function RsvpChart({ side, rsvps }: { side: string; rsvps: AdminData["rsvps"] }) {
  const { yes, no } = rsvpSummary(rsvps);
  const max = Math.max(yes, no, 1);
  return (
    <div className="soft-card space-y-3 p-4">
      <h2 className="text-base font-medium">{side} 측 응답 건수</h2>
      <Bar label="참석 조사 건수" value={yes} max={max} />
      <Bar label="불참 조사 건수" value={no} max={max} />
    </div>
  );
}
