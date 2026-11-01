import { useState } from "react";
import { Section } from "@/components/wedding/Section";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function RsvpSection({ guestName }: { guestName?: string }) {
  const [open, setOpen] = useState("");
  return (
    <Section eyebrow="RSVP" title="참석 여부">
      <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
        <AccordionItem value="rsvp" className="soft-card overflow-hidden border-b-0 px-4">
          <AccordionTrigger className="text-sm hover:no-underline">
            참석 여부 전달하기
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <RsvpForm onDone={() => setOpen("")} onCancel={() => setOpen("")} defaultName={guestName ?? ""} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}
