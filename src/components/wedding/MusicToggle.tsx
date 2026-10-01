import { useEffect, useRef } from "react";
import { Music, VolumeX } from "lucide-react";
import { MUSIC_URL } from "@/lib/wedding-data";

export function MusicToggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: (next: boolean) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) void audio.play().catch(() => undefined);
    else audio.pause();
  }, [on]);

  if (!MUSIC_URL) return null;

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} loop preload="none" />
      <button
        type="button"
        aria-label={on ? "음악 끄기" : "음악 켜기"}
        onClick={() => onToggle(!on)}
        className="fixed top-4 right-4 z-40 rounded-full border border-primary/40 bg-black/40 p-2.5 text-primary backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        {on ? <Music className="size-4" /> : <VolumeX className="size-4" />}
      </button>
    </>
  );
}
