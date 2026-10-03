import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { answerQuestion } from "@/lib/qna.functions";
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
type Question = { id: string; author: string; question: string; answer: string | null; created_at: string };

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rsvp">참석</TabsTrigger>
          <TabsTrigger value="stars">별</TabsTrigger>
          <TabsTrigger value="links">링크</TabsTrigger>
          <TabsTrigger value="photos">사진</TabsTrigger>
          <TabsTrigger value="qna">문의</TabsTrigger>
        </TabsList>

        <TabsContent value="rsvp" className="space-y-3 pt-4">
          <p className="text-sm">
            응답 {data.rsvps.length}건 · 참석 {attending.length}건 · 총 {people}명 · 리마인드 동의{" "}
            {data.rsvps.filter((r) => r.reminder_consent).length}명
          </p>
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
          <p className="text-xs leading-relaxed text-muted-foreground">
            {data.guestbook.map((s) => s.author).join(", ")}
          </p>
        </TabsContent>

        <TabsContent value="links" className="pt-4">
          <InviteeManager code={code} invitees={data.invitees} onChange={() => void login()} />
        </TabsContent>

        <TabsContent value="photos" className="pt-4">
          <PhotoManager code={code} />
        </TabsContent>

        <TabsContent value="qna" className="pt-4">
          <QnaManager code={code} />
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

function QnaManager({ code }: { code: string }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const send = useServerFn(answerQuestion);

  async function load() {
    const { data } = await supabase.from("qna_questions").select("*").order("created_at", { ascending: false });
    setQuestions((data as Question[]) ?? []);
  }

  if (questions === null) {
    return <Button variant="secondary" className="rounded-full" onClick={load}>문의 불러오기</Button>;
  }

  return (
    <div className="space-y-3">
      {questions.length === 0 && <p className="text-xs text-muted-foreground">문의가 없습니다.</p>}
      {questions.map((q) => (
        <div key={q.id} className="soft-card space-y-2 p-3">
          <p className="text-[0.7rem] text-muted-foreground">{q.author}</p>
          <p className="text-sm whitespace-pre-wrap">{q.question}</p>
          {q.answer && <p className="rounded-lg bg-primary/15 p-2 text-xs">A. {q.answer}</p>}
          <Textarea rows={2} value={drafts[q.id] ?? ""} onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))} placeholder="답변 작성" />
          <Button
            size="sm"
            className="rounded-full"
            onClick={async () => {
              try {
                await send({ data: { id: q.id, answer: drafts[q.id] ?? "", code } });
                toast.success("답변이 등록되었습니다");
                await load();
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "실패");
              }
            }}
          >
            답변 등록
          </Button>
        </div>
      ))}
    </div>
  );
}
