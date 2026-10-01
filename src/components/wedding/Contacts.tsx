import { MessageSquare, Phone } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BRIDE_CONTACTS,
  GROOM_CONTACTS,
  type Contact,
} from "@/lib/wedding-data";

function Column({ title, people }: { title: string; people: Contact[] }) {
  return (
    <div className="space-y-4">
      <p className="text-center text-xs tracking-[0.25em] text-primary">
        {title}
      </p>
      {people.map((person) => (
        <div key={person.relation} className="space-y-1 text-center">
          <p className="text-[0.7rem] text-muted-foreground">
            {person.relation}
          </p>
          <p className="serif-title text-sm">{person.name}</p>
          <div className="flex justify-center gap-2 pt-1">
            <a
              href={`tel:${person.phone.replace(/-/g, "")}`}
              aria-label={`${person.name}에게 전화`}
              className="rounded-full border border-primary/40 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Phone className="size-4" />
            </a>
            <a
              href={`sms:${person.phone.replace(/-/g, "")}`}
              aria-label={`${person.name}에게 문자`}
              className="rounded-full border border-primary/40 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MessageSquare className="size-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Contacts() {
  return (
    <Section eyebrow="Contact" title="연락하기">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full rounded-full">
            연락하기
          </Button>
        </DialogTrigger>
        <DialogContent className="dotted-bg max-w-[400px] rounded-3xl border-border">
          <DialogHeader>
            <DialogTitle className="serif-title text-center text-base">
              신랑 · 신부측 연락처
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 divide-x divide-border pt-2">
            <Column title="신랑측" people={GROOM_CONTACTS} />
            <div className="pl-4">
              <Column title="신부측" people={BRIDE_CONTACTS} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
