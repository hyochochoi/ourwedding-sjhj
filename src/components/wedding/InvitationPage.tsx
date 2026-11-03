import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Envelope } from "@/components/wedding/Envelope";
import { Hero } from "@/components/wedding/Hero";
import { Invitation } from "@/components/wedding/Invitation";
import { Gallery } from "@/components/wedding/Gallery";
import { DateSection } from "@/components/wedding/DateSection";
import { Location } from "@/components/wedding/Location";
import { VenueInfo } from "@/components/wedding/VenueInfo";
import { Accounts } from "@/components/wedding/Accounts";
import { Guestbook } from "@/components/wedding/Guestbook";
import { GuestPhotosSection } from "@/components/wedding/GuestPhotos";
import { RsvpSection } from "@/components/wedding/RsvpSection";
import { WeddingDayPopup } from "@/components/wedding/WeddingDayPopup";
import { Footer } from "@/components/wedding/Footer";
import { StarDivider } from "@/components/wedding/Section";
import { getDayMode, orderSections, type DayMode, type SectionId } from "@/lib/day-mode";

export function InvitationPage({ guestName }: { guestName?: string | null }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(true);
  const [mode, setMode] = useState<DayMode>("normal");
  const displayName = guestName?.trim() || "소중한 분";

  useEffect(() => {
    // 미리보기: ?day=1 (예식 당일), ?day=after (예식 1시간 이후)
    const preview = new URLSearchParams(window.location.search).get("day");
    setMode(preview === "after" ? "after" : preview ? "day" : getDayMode(new Date()));
  }, []);

  const sections: Record<SectionId, ReactNode> = {
    invitation: <Invitation />,
    gallery: <Gallery />,
    date: <DateSection />,
    location: <Location />,
    info: <VenueInfo />,
    gift: <Accounts />,
    contact: <Accounts contactsOnly includePhotos={mode === "normal"} />,
    stars: <Guestbook />,
    photos: <GuestPhotosSection />,
    rsvp: <RsvpSection guestName={guestName ?? ""} />,
  };

  return (
    <div className="dotted-bg mx-auto min-h-screen w-full max-w-[480px] overflow-x-clip shadow-[0_0_60px_rgba(0,0,0,0.45)]">
      {envelopeOpen && <Envelope guestName={displayName} onClose={() => setEnvelopeOpen(false)} />}
      {!envelopeOpen && mode !== "normal" && <WeddingDayPopup />}
      <Hero />
      {orderSections(mode).map((id, i) => (
        <Fragment key={id}>
          {i > 0 && <StarDivider />}
          {sections[id]}
        </Fragment>
      ))}
      <Footer />
    </div>
  );
}
