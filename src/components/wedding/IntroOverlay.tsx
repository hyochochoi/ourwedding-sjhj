import { useState } from "react";
import { Music, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { WEDDING } from "@/lib/wedding-data";
import { cn } from "@/lib/utils";

export function IntroOverlay({
  open,
  musicOn,
  onMusicChange,
  onClose,
}: {
  open: boolean;
  musicOn: boolean;
  onMusicChange: (on: boolean) => void;
  onClose: (skipToday: boolean) => void;
}) {
  const [skipToday, setSkipToday] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 pb-3 sm:items-center sm:pb-0">
      <div className="dotted-bg animate-in slide-in-from-bottom-6 max-h-[92vh] w-full max-w-[420px] overflow-y-auto rounded-3xl border border-border p-6 duration-500">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.7rem] tracking-[0.3em] text-primary uppercase">
              Welcome
            </p>
            <h2 className="serif-title mt-2 text-lg">
              {WEDDING.groom.name} · {WEDDING.bride.name} 결혼식에 초대합니다
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {WEDDING.dateLabel} · {WEDDING.venue}
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onClose(skipToday)}
            className="rounded-full p-1 text-primary transition-colors hover:bg-primary/15"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-xs text-muted-foreground">배경 음악</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onMusicChange(true)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm transition-colors",
                musicOn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-secondary/40",
              )}
            >
              <Music className="size-4" /> 켜기
            </button>
            <button
              type="button"
              onClick={() => onMusicChange(false)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm transition-colors",
                !musicOn
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-secondary/40",
              )}
            >
              <VolumeX className="size-4" /> 끄기
            </button>
          </div>
        </div>

        <div className="mt-6">
          {showForm ? (
            <RsvpForm onDone={() => onClose(true)} />
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                참석 여부를 미리 알려주시면 준비에 큰 도움이 됩니다.
              </p>
              <Button
                className="w-full rounded-full"
                onClick={() => setShowForm(true)}
              >
                참석 의사 전달하기
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full text-muted-foreground"
                onClick={() => onClose(skipToday)}
              >
                청첩장 먼저 보기
              </Button>
            </div>
          )}
        </div>

        <label className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={skipToday}
            onChange={(e) => setSkipToday(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          오늘 하루 보지 않기
        </label>
      </div>
    </div>
  );
}
