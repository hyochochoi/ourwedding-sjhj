import { useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding-data";

// 로컬(Vite)과 Lovable 환경 변수 이름을 모두 지원하도록 설정
const KEY = import.meta.env["VITE_KAKAO_MAP_KEY"] || "45e030ffdede598b85a726096551427a";

type KakaoLatLng = object;
type KakaoMapInstance = object;

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLDivElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMapInstance;
  CustomOverlay: new (options: {
    map: KakaoMapInstance;
    position: KakaoLatLng;
    content: HTMLElement;
    xAnchor: number;
    yAnchor: number;
    zIndex: number;
  }) => object;
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
    let active = true;
    const timeout = window.setTimeout(() => {
      if (active) setFailed(true);
    }, 12000);

    const fail = (error?: unknown) => {
      if (!active) return;
      if (error) console.error("Failed to load Kakao map", error);
      window.clearTimeout(timeout);
      setFailed(true);
    };

    const draw = () => {
      const maps = window.kakao?.maps;
      if (!maps?.load) {
        fail();
        return;
      }

      try {
        maps.load(() => {
          if (!active || !ref.current) return;
          try {
            const pos = new maps.LatLng(WEDDING.lat, WEDDING.lng);
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
            window.clearTimeout(timeout);
          } catch (error) {
            fail(error);
          }
        });
      } catch (error) {
        fail(error);
      }
    };

    if (window.kakao?.maps) {
      draw();
    } else {
      const s = document.createElement("script");
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KEY}&autoload=false`;
      s.onload = draw;
      s.onerror = () => fail();
      document.head.appendChild(s);
    }

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  if (failed) {
    return (
      <div
        className="flex h-64 items-center justify-center bg-secondary/40 px-6 text-center text-sm text-muted-foreground"
        role="status"
      >
        카카오 지도를 불러오지 못했습니다. 카카오 Developers의 JavaScript 키와 사이트 도메인 설정을
        확인해 주세요.
      </div>
    );
  }
  return <div ref={ref} className="h-64 w-full" aria-label="카카오맵 예식장 위치" />;
}
