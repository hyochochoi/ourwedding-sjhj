import { useState } from "react";
import { Copy, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

const q = encodeURIComponent(WEDDING.venue);

const MAP_LINKS = [
  { label: "네이버지도", href: `https://map.naver.com/p/search/${q}` },
  { label: "카카오맵", href: `https://map.kakao.com/link/to/${q},${WEDDING.lat},${WEDDING.lng}` },
  { label: "TMAP", href: `https://tmap.life/route?goalname=${q}&goalx=${WEDDING.lng}&goaly=${WEDDING.lat}` },
];

const TABS = [
  {
    id: "transit",
    label: "대중교통",
    items: [
      ["지하철", "3호선 정발산역 3번 출구에서 도보 약 7분. 경의중앙선 백마역에서는 택시로 약 8분입니다."],
      ["버스", "‘정발산역·웨스턴타워’ 정류장 하차 — 간선 1000, 1100, 지선 55, 88번 이용 가능합니다."],
    ],
  },
  {
    id: "parking",
    label: "주차",
    items: [["주차 안내", "웨스턴타워 3차 B동 지하주차장(지하 1~4층)을 이용해 주세요. 하객 2시간 무료이며 9층 안내데스크에서 주차 등록을 도와드립니다."]],
  },
  {
    id: "shuttle",
    label: "셔틀",
    items: [["셔틀버스", "예식 당일 정발산역 3번 출구 앞에서 12:00부터 13:00까지 15분 간격으로 운행합니다."]],
  },
] as const;

export function Location() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("transit");
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(WEDDING.address);
      toast.success("주소가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했어요. 주소를 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <Section eyebrow="Location" title="오시는 길">
      <div className="soft-card space-y-2 p-5 text-center">
        <p className="serif-title text-base">
          {WEDDING.venue} {WEDDING.hall}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{WEDDING.address}</p>
        <Button variant="ghost" size="sm" className="rounded-full text-primary" onClick={copyAddress}>
          <Copy className="size-3.5" /> 주소 복사
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {MAP_LINKS.map((link) => (
          <Button key={link.label} variant="secondary" className="rounded-full px-2 text-xs" asChild>
            <a href={link.href} target="_blank" rel="noreferrer">
              <MapPin className="size-3.5" /> {link.label}
            </a>
          </Button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-1 rounded-full bg-secondary/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full py-2 text-[0.75rem] transition-colors",
              tab === t.id ? "bg-primary font-medium text-primary-foreground" : "text-foreground/80",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="tab-fade mt-3 space-y-2">
        {current.items.map(([title, body]) => (
          <div key={title} className="rounded-2xl bg-cream p-4 text-paper-foreground">
            <p className="serif-title text-sm">{title}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-80">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
