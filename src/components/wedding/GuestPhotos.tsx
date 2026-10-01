import { ImageUp } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import { GUEST_PHOTO_UPLOAD_URL } from "@/lib/wedding-data";

export function GuestPhotos() {
  return (
    <Section eyebrow="Share" title="하객 사진 보내주기">
      <div className="soft-card space-y-4 p-5 text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          예식 당일 담아주신 사진을 공유해 주세요.
          <br />한 번에 최대 100장까지 올리실 수 있습니다.
        </p>

        {GUEST_PHOTO_UPLOAD_URL ? (
          <Button className="w-full rounded-full" asChild>
            <a href={GUEST_PHOTO_UPLOAD_URL} target="_blank" rel="noreferrer">
              <ImageUp className="size-4" /> 사진 올리기
            </a>
          </Button>
        ) : (
          <Button className="w-full rounded-full" disabled>
            <ImageUp className="size-4" /> 사진 올리기 (준비 중)
          </Button>
        )}

        <p className="text-[0.7rem] text-muted-foreground">
          업로드 폴더가 열리면 사진을 선택해 올려주시면 됩니다.
        </p>
      </div>
    </Section>
  );
}
