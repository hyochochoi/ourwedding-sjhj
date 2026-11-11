import { createFileRoute } from "@tanstack/react-router";
import { PersonalInvitation } from "@/components/wedding/PersonalInvitation";
import { getInviteeName } from "@/lib/invitation.functions";
import { invitationPreviewMeta, INVITATION_SHARE_TITLE } from "@/lib/social-preview";

export const Route = createFileRoute("/i/$code")({
  loader: ({ params }) => getInviteeName({ data: { code: params.code } }),
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
