import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/wedding/InvitationPage";
import { invitationPreviewMeta, INVITATION_SHARE_TITLE } from "@/lib/social-preview";

export const Route = createFileRoute("/")({
  head: () => ({ meta: invitationPreviewMeta(INVITATION_SHARE_TITLE) }),
  component: () => <InvitationPage />,
});
