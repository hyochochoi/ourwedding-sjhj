import { createFileRoute, notFound } from "@tanstack/react-router";
import { PersonalInvitation } from "@/components/wedding/PersonalInvitation";

const TITLE = "이상진 · 최효정 결혼식에 초대합니다";
const DESCRIPTION = "당신을 위한 청첩장이 도착했어요. 2027년 3월 14일 오후 1시, 일산 웨스턴빌리프.";

/** 개인 초대 링크: /to-영어이름 */
export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (!/^to-[a-z0-9-]+$/i.test(params.slug)) throw notFound();
  },
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
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <PersonalInvitation code={slug.slice(3)} />;
}
