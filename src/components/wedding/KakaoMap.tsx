import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

const KEY = import.meta.env["VITE_KAKAO_MAP_KEY"] as string | undefined;

type KakaoLatLng = object;
type KakaoMapInstance = object;

interface KakaoAddressResult {
  x: string;
  y: string;
}

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLDivElement, options: { center: KakaoLatLng; level: number }) => KakaoMapInstance;
  CustomOverlay: new (options: {
    map: KakaoMapInstance;
    position: KakaoLatLng;
    content: HTMLElement;
    xAnchor: number;
    yAnchor: number;
    zIndex: number;
  }) => object;
  services: {
    Geocoder: new () => {
      addressSearch: (
        address: string,
        callback: (results: KakaoAddressResult[], status: string) => void,
      ) => void;
    };
    Status: { OK: string };
  };
  load: (callback: () => void) => void;
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

/** 카카오맵 지도. 키가 없거나 불러오지 못하면 설정 안내를 표시합니다. */
export function KakaoMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!KEY);

  useEffect(() => {
    if (!KEY || !ref.current) return;
    const draw = () => {
      window.kakao.maps.load(() => {
        if (!ref.current) return;
        const { maps } = window.kakao;
        const geocoder = new maps.services.Geocoder();
        geocoder.addressSearch(WEDDING.address, (results, status) => {
          if (!ref.current) return;
          if (status !== maps.services.Status.OK || !results[0]) {
            setFailed(true);
            return;
          }
          const pos = new maps.LatLng(Number(results[0].y), Number(results[0].x));
          const map = new maps.Map(ref.current, { center: pos, level: 5 });

          const marker = document.createElement("div");
          marker.className = "venue-map-marker";
          marker.setAttribute("aria-label", "예식장 위치");
          const label = document.createElement("span");
          label.className = "venue-map-marker__label";
          label.textContent = "웨스턴타워 3차 · 예식장";
          const pin = document.createElement("span");
          pin.className = "venue-map-marker__pin";
          marker.append(label, pin);

          new maps.CustomOverlay({
            map,
            position: pos,
            content: marker,
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 10,
          });
        });
      });
    };
    if (window.kakao?.maps) return draw();
    const s = document.createElement("script");
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false&libraries=services`;
    s.onload = draw;
    s.onerror = () => setFailed(true);
    document.head.appendChild(s);
  }, []);

  if (failed) {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary/40 px-6 text-center text-sm text-muted-foreground" role="status">
        카카오 지도를 불러오지 못했습니다. 카카오 Developers의 JavaScript 키와 사이트 도메인 설정을 확인해 주세요.
      </div>
    );
  }
  return <div ref={ref} className="h-64 w-full" aria-label="카카오맵 예식장 위치" />;
}
