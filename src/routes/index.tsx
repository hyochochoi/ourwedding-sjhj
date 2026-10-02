import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/wedding/InvitationPage";

const TITLE = "이상진 · 최효정 결혼합니다 | 2027.03.14";
const DESCRIPTION =
  "2027년 3월 14일 일요일 오후 1시, 일산 웨스턴빌리프 9층 그랜드홀에서 이상진과 최효정이 결혼합니다.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <InvitationPage />,
});
