import { useState } from "react";
import { Envelope } from "@/components/wedding/Envelope";
import { Hero } from "@/components/wedding/Hero";
import { Invitation } from "@/components/wedding/Invitation";
import { Contacts } from "@/components/wedding/Contacts";
import { Gallery } from "@/components/wedding/Gallery";
import { DateSection } from "@/components/wedding/DateSection";
import { Location } from "@/components/wedding/Location";
import { VenueInfo } from "@/components/wedding/VenueInfo";
import { Accounts } from "@/components/wedding/Accounts";
import { GuestPhotos } from "@/components/wedding/GuestPhotos";
import { Guestbook } from "@/components/wedding/Guestbook";
import { Qna } from "@/components/wedding/Qna";
import { RsvpSection } from "@/components/wedding/RsvpSection";
import { Footer } from "@/components/wedding/Footer";
import { StarDivider } from "@/components/wedding/Section";

export function InvitationPage({ guestName }: { guestName?: string | null }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(true);
  const displayName = guestName?.trim() || "소중한 분";

  return (
    <div className="dotted-bg mx-auto min-h-screen w-full max-w-[480px] overflow-x-hidden shadow-[0_0_60px_rgba(0,0,0,0.45)]">
      {envelopeOpen && (
        <Envelope guestName={displayName} onClose={() => setEnvelopeOpen(false)} />
      )}

      <Hero />
      <Invitation />
      <StarDivider />
      <Contacts />
      <StarDivider />
      <Gallery />
      <StarDivider />
      <DateSection />
      <StarDivider />
      <Location />
      <StarDivider />
      <VenueInfo />
      <StarDivider />
      <Accounts />
      <StarDivider />
      <GuestPhotos />
      <StarDivider />
      <Guestbook />
      <StarDivider />
      <Qna />
      <StarDivider />
      <RsvpSection guestName={guestName ?? undefined} />
      <Footer />
    </div>
  );
}
