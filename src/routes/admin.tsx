import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createInvitee,
  deleteInvitee,
  getAdminData,
  getGuestPhotos,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "신랑·신부 관리 | 이상진 · 최효정 결혼식" },
      { name: "description", content: "참석 여부, 축하의 별, 초대 링크, 하객 사진을 관리합니다." },
      { property: "og:title", content: "신랑·신부 관리" },
      { property: "og:description", content: "참석 여부, 축하의 별, 초대 링크, 하객 사진을 관리합니다." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type AdminData = Awaited<ReturnType<typeof getAdminData>>;
type Photo = { name: string; downloadUrl: string; previewUrl: string };

const STAR_COLORS = ["var(--star-1)", "var(--star-2)", "var(--star-3)", "var(--star-4)", "var(--star-5)", "var(--star-6)"];

function AdminPage() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchData = useServerFn(getAdminData);

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
      <form onSubmit={login} className="mx-auto flex min-h-screen max-w-[400px] flex-col justify-center gap-3 px-6">
        <h1 className="serif-title text-center text-lg">신랑 · 신부 관리</h1>
        <Input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="관리자 코드" />
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
          <RsvpChart rsvps={data.rsvps} />
          {data.rsvps.map((r) => (
            <div key={r.id} className="soft-card p-3 text-xs">
              <p className="text-sm">
                {r.name} <span className="text-muted-foreground">· {r.side}</span>
              </p>
              <p className="mt-1 text-muted-foreground">
                {r.attendance} · {r.guest_count}명 {r.phone ? `· ${r.phone}` : ""}{" "}
                {r.reminder_consent ? "· 리마인드 동의" : ""}
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="stars" className="space-y-3 pt-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-sky">
            {data.guestbook.map((s) => (
              <span
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${s.pos_x}%`, top: `${s.pos_y}%` }}
              >
                <Star className="mx-auto size-4" style={{ color: STAR_COLORS[s.color_index % 6], fill: STAR_COLORS[s.color_index % 6] }} />
                <span className="text-[0.6rem] whitespace-nowrap text-foreground/80">{s.author}</span>
              </span>
            ))}
          </div>
          <p className="text-sm">별 {data.guestbook.length}개</p>
          <div className="space-y-2">
            {data.guestbook.map((s) => (
              <div key={s.id} className="soft-card p-3 text-xs">
                <p className="text-sm">
                  <Star className="mr-1 inline size-3" style={{ color: STAR_COLORS[s.color_index % 6], fill: STAR_COLORS[s.color_index % 6] }} />
                  {s.author}
                  <span className="ml-2 text-[0.65rem] text-muted-foreground">{new Date(s.created_at).toLocaleString("ko-KR")}</span>
                </p>
                {s.content && <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{s.content}</p>}
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
  const create = useServerFn(createInvitee);
  const remove = useServerFn(deleteInvitee);
  const origin = typeof window === "undefined" ? "" : window.location.origin;

  async function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await create({ data: { code, name } });
      await navigator.clipboard.writeText(`${origin}/i/${res.code}`).catch(() => undefined);
      toast.success(`${name}님 링크를 만들고 복사했어요 🌿`);
      setName("");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "생성 실패");
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={add} className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="받는 분 이름 (예: 김민지)" />
        <Button type="submit" className="shrink-0 rounded-full">만들기</Button>
      </form>
      {invitees.map((inv) => {
        const url = `${origin}/i/${inv.code}`;
        return (
          <div key={inv.id} className="soft-card flex items-center gap-2 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm">To. {inv.name}</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">{url}</p>
            </div>
            <Button size="icon" variant="ghost" aria-label="복사" onClick={() => { void navigator.clipboard.writeText(url); toast.success("링크가 복사되었습니다 🌿"); }}>
              <Copy className="size-4" />
            </Button>
            <Button size="icon" variant="ghost" aria-label="삭제" onClick={async () => { await remove({ data: { code, id: inv.id } }); onChange(); }}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function PhotoManager({ code }: { code: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const fetchPhotos = useServerFn(getGuestPhotos);

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

  async function downloadAll() {
    for (const photo of photos) {
      const a = document.createElement("a");
      a.href = photo.downloadUrl;
      a.download = photo.name;
      a.click();
      await new Promise((r) => setTimeout(r, 350));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="secondary" className="rounded-full" disabled={loading || !hasMore} onClick={loadMore}>
          {loading ? "불러오는 중..." : photos.length ? "더 불러오기" : "사진 불러오기"}
        </Button>
        {photos.length > 0 && (
          <Button className="rounded-full" onClick={downloadAll}>
            <Download className="size-4" /> 불러온 {photos.length}장 모두 받기
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <a key={p.name} href={p.downloadUrl} className="block overflow-hidden rounded-lg bg-secondary">
            <img src={p.previewUrl} alt={p.name} loading="lazy" className="aspect-square w-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 shrink-0 text-muted-foreground">{label}</span>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-secondary/50">
        <div className="h-full rounded-full bg-primary" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="w-10 text-right tabular-nums">{value}</span>
    </div>
  );
}

function RsvpChart({ rsvps }: { rsvps: AdminData["rsvps"] }) {
  const yes = rsvps.filter((r) => r.attendance === "참석");
  const no = rsvps.length - yes.length;
  const people = yes.reduce((sum, r) => sum + (r.guest_count || 0), 0);
  const remind = rsvps.filter((r) => r.reminder_consent).length;
  const max = Math.max(rsvps.length, people, 1);
  const pct = rsvps.length ? Math.round((yes.length / rsvps.length) * 100) : 0;
  return (
    <div className="soft-card space-y-3 p-4">
      <div className="flex items-center gap-4">
        <div
          className="size-20 shrink-0 rounded-full"
          style={{ background: `conic-gradient(var(--primary) ${pct}%, var(--secondary) 0)` }}
          aria-label={`참석 ${pct}%`}
        >
          <div className="m-3 flex size-14 items-center justify-center rounded-full bg-background text-sm">{pct}%</div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">참석 응답 비율<br />식사 예상 인원 {people}명</p>
      </div>
      <Bar label="응답" value={rsvps.length} max={max} />
      <Bar label="참석" value={yes.length} max={max} />
      <Bar label="불참" value={no} max={max} />
      <Bar label="총 인원" value={people} max={max} />
      <Bar label="리마인드" value={remind} max={max} />
    </div>
  );
}
