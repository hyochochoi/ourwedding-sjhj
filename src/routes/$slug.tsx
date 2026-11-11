import { createFileRoute, notFound } from "@tanstack/react-router";
import { PersonalInvitation } from "@/components/wedding/PersonalInvitation";
import { getInviteeName } from "@/lib/invitation.functions";
import { invitationPreviewMeta, INVITATION_SHARE_TITLE } from "@/lib/social-preview";

/** 개인 초대 링크: /to-영어이름 */
export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (!/^to-[a-z0-9-]+$/i.test(params.slug)) throw notFound();
  },
  loader: ({ params }) => getInviteeName({ data: { code: params.slug.slice(3) } }),
  head: ({ loaderData }) => ({
    meta: invitationPreviewMeta(
      loaderData ? `To. ${loaderData}` : INVITATION_SHARE_TITLE,
    ),
  }),
  component: Page,
});

function Page() {
  const guestName = Route.useLoaderData();
  return <PersonalInvitation guestName={guestName} />;
}
