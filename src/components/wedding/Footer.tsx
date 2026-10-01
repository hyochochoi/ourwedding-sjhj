import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WEDDING } from "@/lib/wedding-data";

export function Footer() {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("청첩장 링크가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했어요.");
    }
  }

  async function share() {
    const shareData = {
      title: `${WEDDING.groom.name} · ${WEDDING.bride.name} 결혼합니다`,
      text: `${WEDDING.dateLabel} · ${WEDDING.venue}`,
      url: typeof window === "undefined" ? "" : window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* 사용자가 공유를 취소함 */
      }
      return;
    }
    await copyLink();
  }

  return (
    <footer className="px-6 pt-4 pb-14 text-center">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" className="rounded-full" onClick={share}>
          <Share2 className="size-4" /> 공유하기
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={copyLink}>
          <Link2 className="size-4" /> 링크 복사
        </Button>
      </div>
      <p className="serif-title mt-8 text-sm text-primary">
        {WEDDING.groom.name} · {WEDDING.bride.name}
      </p>
      <p className="mt-1 text-[0.7rem] text-muted-foreground">
        2027. 03. 14 · {WEDDING.venue}
      </p>
    </footer>
  );
}
