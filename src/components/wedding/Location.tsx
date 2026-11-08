import { BusFront, CarFront, Copy, MapPin, TrainFront } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";
import { KakaoMap } from "@/components/wedding/KakaoMap";

const q = encodeURIComponent(WEDDING.address);

const MAP_LINKS = [
  { label: "네이버지도", href: `https://map.naver.com/p/search/${q}` },
  { label: "카카오맵", href: `https://map.kakao.com/link/to/${q},${WEDDING.lat},${WEDDING.lng}` },
  {
    label: "TMAP",
    href: `https://tmap.life/route?goalname=${q}&goalx=${WEDDING.lng}&goaly=${WEDDING.lat}`,
  },
];

const DIRECTIONS = [
  {
    label: "지하철",
    Icon: TrainFront,
    items: [
      <>
        3호선 <strong>정발산역 1번 출구</strong>에서 도보 10분
      </>,
      <>
        3호선 <strong>마두역 4번 출구</strong>에서 도보 10분
      </>,
    ],
  },
  {
    label: "버스",
    Icon: BusFront,
    items: [
      <>
        <strong>일산 동구청(중)</strong> 하차 · 도보 7분
      </>,
    ],
  },
  {
    label: "셔틀",
    Icon: BusFront,
    items: [
      <>
        <strong>마두역 4번 출구</strong>에서 수시 운행
      </>,
    ],
  },
  {
    label: "주차",
    Icon: CarFront,
    items: [
      <>
        <strong>웨스턴타워 3차 B동 지하주차장</strong> 이용 (1,300대 가능)
      </>,
      <>
        B2층 주차 시 CGV 엘리베이터 탑승 후 B1층 하차
        <br />→ 건너편 <strong>6, 7호기 엘리베이터</strong> 이용하여 <strong>9F 하차</strong>
      </>,
    ],
  },
] as const;

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
    <Section eyebrow="Location" title="오시는 길">
      <div className="soft-card space-y-2 p-5 text-center">
        <p className="serif-title text-base">
          {WEDDING.venue} {WEDDING.hall}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">{WEDDING.address}</p>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-primary"
          onClick={copyAddress}
        >
          <Copy className="size-3.5" /> 주소 복사
        </Button>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border">
        <KakaoMap />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {MAP_LINKS.map((link) => (
          <Button
            key={link.label}
            variant="secondary"
            className="rounded-full px-2 text-xs"
            asChild
          >
            <a href={link.href} target="_blank" rel="noreferrer">
              <MapPin className="size-3.5" /> {link.label}
            </a>
          </Button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-border/90 border-y border-border/90">
        {DIRECTIONS.map(({ label, Icon, items }) => (
          <section key={label} className="grid grid-cols-[1.25rem_1fr] gap-3 py-4">
            <Icon
              className="mt-0.5 size-4 text-foreground/70"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h3 className="w-fit rounded-sm bg-tape-pink px-1.5 py-0.5 text-sm font-semibold text-paper-foreground shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
                {label}
              </h3>
              <ul className="mt-1 space-y-1 text-sm leading-relaxed text-foreground/80">
                {items.map((line, index) => (
                  <li key={`${label}-${index}`} className="break-keep">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
