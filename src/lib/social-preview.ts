import { SHARE_PHOTO_URL } from "@/lib/wedding-photos";

export const INVITATION_SHARE_TITLE = "이상진♥최효정 결혼합니다.";
export const INVITATION_SHARE_DESCRIPTION =
  "2027년 03월 14일 일요일 오후 1시\n일산 웨스턴빌리프 9F";

export function invitationPreviewMeta(title: string) {
  return [
    { title },
    { name: "description", content: INVITATION_SHARE_DESCRIPTION },
    { property: "og:title", content: title },
    { property: "og:description", content: INVITATION_SHARE_DESCRIPTION },
    { property: "og:type", content: "website" },
    { property: "og:image", content: SHARE_PHOTO_URL },
    { property: "og:image:width", content: "768" },
    { property: "og:image:height", content: "1152" },
    { property: "og:image:alt", content: "이상진과 최효정의 웨딩 사진" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: SHARE_PHOTO_URL },
  ];
}
