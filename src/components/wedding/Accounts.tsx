import { useState } from "react";
import { Check, Copy, MessageSquare, Phone } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { GuestPhotosButton } from "@/components/wedding/GuestPhotos";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BRIDE_ACCOUNTS,
  GROOM_ACCOUNTS,
  BRIDE_CONTACTS,
  GROOM_CONTACTS,
  type Account,
  type Contact,
} from "@/lib/wedding-data";

function AccountRow({ account }: { account: Account }) {
  const [copied, setCopied] = useState(false);
  const full = `${account.bank} ${account.number} ${account.name}`;

  async function copy() {
    if (!account.number) {
      toast.info("계좌번호가 아직 등록되지 않았어요.");
      return;
    }
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      toast.success("계좌번호가 복사되었습니다");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했어요. 길게 눌러 복사해 주세요.");
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-4">
      <p className="text-[0.7rem] text-muted-foreground">{account.relation}</p>
      <p className="serif-title mt-0.5 text-sm">{account.name}</p>
      <p className="mt-1 text-xs text-foreground/85">
        {account.number ? full : "계좌번호 준비 중입니다"}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" className="rounded-full" onClick={copy}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "복사 완료" : "계좌번호 복사"}
        </Button>
        {account.kakaopay && (
          <Button size="sm" variant="secondary" className="rounded-full" asChild>
            <a href={account.kakaopay} target="_blank" rel="noreferrer">
              카카오페이 송금
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function ContactRow({ person }: { person: Contact }) {
  const tel = person.phone.replace(/-/g, "");
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-3">
      <div>
        <p className="text-[0.7rem] text-muted-foreground">{person.relation}</p>
        <p className="serif-title text-sm">{person.name}</p>
      </div>
      <div className="flex gap-2">
        <a href={`tel:${tel}`} aria-label={`${person.name}에게 전화`} className="rounded-full border border-primary/40 p-2 text-primary">
          <Phone className="size-4" />
        </a>
        <a href={`sms:${tel}`} aria-label={`${person.name}에게 문자`} className="rounded-full border border-primary/40 p-2 text-primary">
          <MessageSquare className="size-4" />
        </a>
      </div>
    </div>
  );
}

function Group({ value, title, children }: { value: string; title: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={value} className="soft-card overflow-hidden border-b-0 px-4">
      <AccordionTrigger className="text-sm hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="space-y-3 pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

export function Accounts({ contactsOnly = false, includePhotos = false }: { contactsOnly?: boolean; includePhotos?: boolean }) {
  return (
    <Section eyebrow={contactsOnly ? "Contact" : "With Heart"} title={contactsOnly ? "연락하기" : "마음 전하실 곳"}>
      <div className="tab-fade">
        {!contactsOnly ? (
          <>
            <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
              축하의 마음을 담아 축의금을 전달하실 수 있도록
              <br />
              계좌번호를 안내드립니다.
            </p>
            <Accordion type="single" collapsible className="space-y-3">
              <Group value="groom" title="신랑측 계좌번호">
                {GROOM_ACCOUNTS.map((a) => <AccountRow key={a.relation} account={a} />)}
              </Group>
              <Group value="bride" title="신부측 계좌번호">
                {BRIDE_ACCOUNTS.map((a) => <AccountRow key={a.relation} account={a} />)}
              </Group>
            </Accordion>
          </>
        ) : (
          <Accordion type="multiple" defaultValue={["groom", "bride"]} className="space-y-3">
            <Group value="groom" title="신랑측 연락처">
              {GROOM_CONTACTS.map((p) => <ContactRow key={p.relation} person={p} />)}
            </Group>
            <Group value="bride" title="신부측 연락처">
              {BRIDE_CONTACTS.map((p) => <ContactRow key={p.relation} person={p} />)}
            </Group>
          </Accordion>
        )}
      </div>
      {includePhotos && <div className="mt-6"><GuestPhotosButton /></div>}
    </Section>
  );
}
