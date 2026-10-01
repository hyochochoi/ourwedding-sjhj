import { Banknote, Camera, ParkingCircle, Utensils } from "lucide-react";
import { Section } from "@/components/wedding/Section";

const CARDS = [
  {
    icon: ParkingCircle,
    title: "주차 안내",
    body: "웨스턴타워 3차 B동 지하주차장(지하 1~4층)을 이용해 주세요. 예식 2시간 무료이며, 9층 안내데스크에서 주차 등록을 도와드립니다. 만차 시 인근 정발산 공영주차장을 이용하실 수 있습니다.",
  },
  {
    icon: Banknote,
    title: "ATM",
    body: "건물 1층 로비와 지하 1층 편의점 옆에 ATM이 있습니다. 축의금 접수대는 9층 연회장 입구에 마련되어 있습니다.",
  },
  {
    icon: Camera,
    title: "포토부스",
    body: "9층 홀 입구에 포토부스를 준비했습니다. 촬영하신 사진은 즉석 인화되며, QR로 전송받아 하객 사진함에 바로 올려주실 수 있습니다.",
  },
  {
    icon: Utensils,
    title: "식사 안내",
    body: "예식 후 같은 층 연회장에서 뷔페로 준비됩니다. 식사 시간은 예식 종료 후 약 2시간 동안 운영됩니다.",
  },
];

export function VenueInfo() {
  return (
    <Section eyebrow="Information" title="안내 사항">
      <div className="space-y-3">
        {CARDS.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl bg-paper p-5 text-paper-foreground shadow-[0_14px_30px_-22px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-2">
              <card.icon className="size-4 text-paper-foreground/70" />
              <h3 className="serif-title text-sm">{card.title}</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-paper-foreground/75">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
