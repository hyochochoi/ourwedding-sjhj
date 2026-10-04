import { Bus, Car, Copy, MapPin, TrainFront } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";

const q = encodeURIComponent(WEDDING.venue);
const addr = encodeURIComponent(WEDDING.address);

const MAP_LINKS = [
  { label: "네이버지도", href: `https://map.naver.com/p/search/${q}` },
  { label: "카카오맵", href: `https://map.kakao.com/?q=${q}` },
  {
    label: "구글맵",
    href: `https://www.google.com/maps/search/?api=1&query=${addr}`,
  },
  {
    label: "티맵",
    href: `https://tmap.life/route?goalname=${q}&goalx=${WEDDING.lng}&goaly=${WEDDING.lat}`,
  },
];

const TRANSPORT = [
  {
    icon: Car,
    title: "자가용",
    body: "내비게이션에 ‘웨스턴타워 3차’ 또는 ‘정발산로 24’를 검색해 주세요. 자유로·강변북로에서 약 20분 거리입니다.",
  },
  {
    icon: TrainFront,
    title: "지하철",
    body: "3호선 정발산역 3번 출구에서 도보 약 7분. 경의중앙선 백마역에서는 택시로 약 8분입니다.",
  },
  {
    icon: Bus,
    title: "버스",
    body: "‘정발산역·웨스턴타워’ 정류장 하차 — 간선 1000, 1100, 지선 55, 88번 이용 가능합니다.",
  },
  {
    icon: Bus,
    title: "셔틀버스",
    body: "예식 당일 정발산역 3번 출구 앞에서 12:00부터 13:00까지 15분 간격으로 셔틀을 운행합니다.",
  },
];

export function Location() {
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(WEDDING.address);
      toast.success("주소가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했어요. 주소를 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <div>
      <div className="soft-card overflow-hidden">
        <iframe
          title="예식장 지도"
          src={`https://www.google.com/maps?q=${addr}&output=embed&hl=ko`}
          className="h-56 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="space-y-2 p-5 text-center">
          <p className="serif-title text-base">
            {WEDDING.venue} {WEDDING.hall}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {WEDDING.address}
          </p>
          <p className="text-xs text-muted-foreground">{WEDDING.dateLabel}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 rounded-full text-primary"
            onClick={copyAddress}
          >
            <Copy className="size-3.5" /> 주소 복사
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {MAP_LINKS.map((link) => (
          <Button
            key={link.label}
            variant="secondary"
            className="rounded-full"
            asChild
          >
            <a href={link.href} target="_blank" rel="noreferrer">
              <MapPin className="size-4" /> {link.label}
            </a>
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {TRANSPORT.map((item) => (
          <div key={item.title} className="soft-card flex gap-3 p-4">
            <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
