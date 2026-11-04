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
  { id: "subway", label: "지하철", items: ["3호선 정발산역 1번 출구 도보 10분", "3호선 마두역 4번 출구 도보 10분"] },
  { id: "shuttle", label: "셔틀버스", items: ["마두역 4번 출구 수시 운행"] },
  { id: "parking", label: "주차", items: ["웨스턴돔 B동 주차장 이용", "(하객 주차 2시간 무료)"] },
] as const;

export function Location() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("subway");
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

      <div className="mt-3 overflow-hidden rounded-2xl border border-border">
        <iframe
          title="예식장 위치 지도"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${WEDDING.lng - 0.006}%2C${WEDDING.lat - 0.004}%2C${WEDDING.lng + 0.006}%2C${WEDDING.lat + 0.004}&layer=mapnik&marker=${WEDDING.lat}%2C${WEDDING.lng}`}
          loading="lazy"
          className="h-64 w-full border-0"
        />
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
        <div className="rounded-2xl bg-cream p-4 text-center text-paper-foreground">
          <p className="serif-title text-sm">{current.label}</p>
          {current.items.map((line) => (
            <p key={line} className="mt-1 text-xs leading-relaxed opacity-80 break-keep">{line}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
