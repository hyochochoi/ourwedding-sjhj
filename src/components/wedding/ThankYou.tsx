import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/wedding/Section";
import { WEDDING } from "@/lib/wedding-data";
import { INVITATION_SHARE_DESCRIPTION, INVITATION_SHARE_TITLE } from "@/lib/social-preview";

export function ThankYou({ guestName }: { guestName?: string | null }) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("청첩장 링크가 복사되었습니다");
    } catch {
      toast.error("링크 복사에 실패했어요.");
    }
  }

  async function share() {
    const shareData = {
      title: guestName?.trim() ? `To. ${guestName.trim()}` : INVITATION_SHARE_TITLE,
      text: INVITATION_SHARE_DESCRIPTION,
      url: window.location.href,
    };

    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error instanceof DOMException && error.name !== "AbortError") {
        toast.error("공유를 시작하지 못했어요.");
      }
    }
  }

  return (
    <Section id="thank-you" eyebrow="Thank you" title="감사합니다" className="pb-10">
      <video
        className="aspect-video w-full rounded-2xl border border-border/70 bg-black object-contain"
        src="/thank-you-video.mp4"
        controls
        playsInline
        preload="metadata"
        aria-label="감사 영상"
      />
      <p className="mt-7 text-center text-sm leading-relaxed text-foreground/90">
        저희 두 사람의 시작을
        <br />
        함께해 주셔서 감사합니다.
      </p>
      <p className="mt-2 text-center text-sm font-medium text-primary">
        {WEDDING.groom.name} · {WEDDING.bride.name} 올림
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="secondary" className="rounded-full" onClick={share}>
          <Share2 className="size-4" /> 카카오톡 공유
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={copyLink}>
          <Link2 className="size-4" /> 링크 복사
        </Button>
      </div>
    </Section>
  );
}
