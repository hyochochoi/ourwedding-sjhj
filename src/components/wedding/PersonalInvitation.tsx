import { InvitationPage } from "@/components/wedding/InvitationPage";

export function PersonalInvitation({ guestName }: { guestName: string | null }) {
  return <InvitationPage guestName={guestName} />;
}
