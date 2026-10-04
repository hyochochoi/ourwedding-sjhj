import { useState } from "react";
import { Envelope } from "@/components/wedding/Envelope";
import { QuickBar } from "@/components/wedding/QuickBar";
import { Hero } from "@/components/wedding/Hero";
import { Invitation } from "@/components/wedding/Invitation";
import { Contacts } from "@/components/wedding/Contacts";
import { Gallery } from "@/components/wedding/Gallery";
import { DateSection } from "@/components/wedding/DateSection";
import { InfoTabs } from "@/components/wedding/InfoTabs";
import { Guestbook } from "@/components/wedding/Guestbook";
import { RsvpSection } from "@/components/wedding/RsvpSection";
import { Footer } from "@/components/wedding/Footer";
import { StarDivider } from "@/components/wedding/Section";

export function InvitationPage({ guestName }: { guestName?: string | null }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(true);
  const displayName = guestName?.trim() || "소중한 분";

  return (
    <div className="dotted-bg mx-auto min-h-screen w-full max-w-[480px] overflow-x-clip shadow-[0_0_60px_rgba(0,0,0,0.45)]">
      {envelopeOpen && <Envelope guestName={displayName} onClose={() => setEnvelopeOpen(false)} />}
      <QuickBar />
      <Hero />
      <Invitation />
      <StarDivider />
      <Contacts />
      <StarDivider />
      <Gallery />
      <StarDivider />
      <DateSection />
      <StarDivider />
      <InfoTabs />
      <StarDivider />
      <Guestbook />
      <StarDivider />
      <RsvpSection guestName={guestName ?? ""} />
      <Footer />
    </div>
  );
}
