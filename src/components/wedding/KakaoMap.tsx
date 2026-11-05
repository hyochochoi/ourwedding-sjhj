import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

const KEY = import.meta.env.VITE_KAKAO_MAP_KEY as string | undefined;

declare global {
  interface Window { kakao?: any }
}

/** 카카오맵 지도. 키가 없거나 불러오지 못하면 기본 지도로 대체 */
export function KakaoMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!KEY);

  useEffect(() => {
    if (!KEY || !ref.current) return;
    const draw = () => {
      window.kakao.maps.load(() => {
        if (!ref.current) return;
        const { maps } = window.kakao;
        const pos = new maps.LatLng(WEDDING.lat, WEDDING.lng);
        const map = new maps.Map(ref.current, { center: pos, level: 3 });
        new maps.Marker({ position: pos, map });
      });
    };
    if (window.kakao?.maps) return draw();
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`;
    s.onload = draw;
    s.onerror = () => setFailed(true);
    document.head.appendChild(s);
  }, []);

  if (failed) {
    return (
      <iframe
        title="예식장 위치 지도"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${WEDDING.lng - 0.006}%2C${WEDDING.lat - 0.004}%2C${WEDDING.lng + 0.006}%2C${WEDDING.lat + 0.004}&layer=mapnik&marker=${WEDDING.lat}%2C${WEDDING.lng}`}
        loading="lazy"
        className="h-64 w-full border-0"
      />
    );
  }
  return <div ref={ref} className="h-64 w-full" aria-label="카카오맵 예식장 위치" />;
}
