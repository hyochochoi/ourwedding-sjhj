import { Section } from "@/components/wedding/Section";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function RsvpSection({ guestName }: { guestName?: string }) {
  return (
    <Section eyebrow="RSVP" title="참석 여부">
      <Accordion type="single" collapsible>
        <AccordionItem value="rsvp" className="soft-card overflow-hidden border-b-0 px-4">
          <AccordionTrigger className="text-sm hover:no-underline">
            참석 여부 전달하기
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <RsvpForm defaultName={guestName} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}
