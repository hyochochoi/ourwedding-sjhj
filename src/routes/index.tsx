import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IntroOverlay } from "@/components/wedding/IntroOverlay";
import { MusicToggle } from "@/components/wedding/MusicToggle";
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
import { Footer } from "@/components/wedding/Footer";
import { Section, StarDivider } from "@/components/wedding/Section";
import { RsvpForm } from "@/components/wedding/RsvpForm";

const TITLE = "이상진 · 최효정 결혼합니다 | 2027.03.14";
const DESCRIPTION =
  "2027년 3월 14일 일요일 오후 1시, 일산 웨스턴빌리프 9층 그랜드홀에서 이상진과 최효정이 결혼합니다. 참석 여부와 축하 메시지를 남겨주세요.";

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
  component: Index,
});

const SKIP_KEY = "wedding-intro-skip";

function Index() {
  const [introOpen, setIntroOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (window.localStorage.getItem(SKIP_KEY) === today) return;
    const timer = window.setTimeout(() => setIntroOpen(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  function closeIntro(skipToday: boolean) {
    if (skipToday) {
      window.localStorage.setItem(SKIP_KEY, new Date().toDateString());
    }
    setIntroOpen(false);
  }

  return (
    <div className="dotted-bg mx-auto min-h-screen w-full max-w-[480px] overflow-x-hidden shadow-[0_0_60px_rgba(0,0,0,0.45)]">
      <MusicToggle on={musicOn} onToggle={setMusicOn} />
      <IntroOverlay
        open={introOpen}
        musicOn={musicOn}
        onMusicChange={setMusicOn}
        onClose={closeIntro}
      />

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
      <Section eyebrow="RSVP" title="참석 여부 전달">
        <p className="mb-5 text-center text-xs leading-relaxed text-muted-foreground">
          소중한 걸음을 미리 알려주시면
          <br />
          정성껏 준비하는 데 큰 도움이 됩니다.
        </p>
        <RsvpForm />
      </Section>
      <StarDivider />
      <Guestbook />
      <StarDivider />
      <Qna />
      <Footer />
    </div>
  );
}
