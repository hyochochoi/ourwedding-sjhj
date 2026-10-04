import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

const q = encodeURIComponent(WEDDING.venue);

/** 예식 당일(한국 시간 2027-03-14)에만 상단에 고정. ?quickbar=1 로 미리보기 가능 */
export function QuickBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
    const preview = new URLSearchParams(window.location.search).has("quickbar");
    setShow(kst === "2027-03-14" || preview);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-primary/30 bg-envelope-shade/95 px-4 py-2.5 text-center backdrop-blur">
      <p className="text-sm text-primary">오늘은 상진🤍효정의 결혼식 날입니다! 🌿</p>
      <p className="mt-0.5 text-[0.7rem] text-cream/80">
        오후 1시 · {WEDDING.venue} {WEDDING.hall}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <a className="rounded-full bg-primary py-1 text-[0.7rem] text-primary-foreground" href={`https://map.naver.com/p/search/${q}`} target="_blank" rel="noreferrer">
          네이버지도
        </a>
        <a className="rounded-full bg-primary py-1 text-[0.7rem] text-primary-foreground" href={`https://map.kakao.com/link/to/${q},${WEDDING.lat},${WEDDING.lng}`} target="_blank" rel="noreferrer">
          카카오내비
        </a>
        <a className="rounded-full bg-primary py-1 text-[0.7rem] text-primary-foreground" href={`https://tmap.life/route?goalname=${q}&goalx=${WEDDING.lng}&goaly=${WEDDING.lat}`} target="_blank" rel="noreferrer">
          티맵
        </a>
      </div>
    </div>
  );
}
