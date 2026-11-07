import { useState } from "react";
import { Check, Copy, MessageSquare, Phone } from "lucide-react";
import { Section } from "@/components/wedding/Section";
import { GuestPhotosButton } from "@/components/wedding/GuestPhotos";
import { toast } from "sonner";
import type { ReactNode } from "react";
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

function AccountRow({ account, contact }: { account: Account; contact?: Contact }) {
  const [copied, setCopied] = useState(false);
  const full = `${account.bank} ${account.number} ${account.name}`;
  const tel = contact?.phone.replace(/\D/g, "");

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
    <div className="account-card rounded-2xl border border-border bg-secondary/30 p-4">
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
        {contact && tel && (
          <>
            <Button size="sm" variant="secondary" className="rounded-full" asChild>
              <a href={`tel:${tel}`} aria-label={`${contact.name}에게 전화`}>
                <Phone className="size-3.5" /> 통화
              </a>
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full" asChild>
              <a href={`sms:${tel}`} aria-label={`${contact.name}에게 문자`}>
                <MessageSquare className="size-3.5" /> 메시지
              </a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Group({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem value={value} className="soft-card overflow-hidden border-b-0 px-4">
      <AccordionTrigger className="text-sm hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="space-y-3 pb-4">{children}</AccordionContent>
    </AccordionItem>
  );
}

export function Accounts({ includePhotos = false }: { includePhotos?: boolean }) {
  return (
    <Section eyebrow="With Heart" title="마음 전하실 곳">
      <div className="tab-fade">
        <p className="mb-4 text-center text-xs leading-relaxed text-muted-foreground">
          축하의 마음을 전달하실 수 있도록 안내 드립니다.
        </p>
        <Accordion type="single" collapsible className="space-y-3">
          <Group value="groom" title="신랑측">
            {GROOM_ACCOUNTS.map((account) => (
              <AccountRow
                key={account.relation}
                account={account}
                contact={GROOM_CONTACTS.find((person) => person.relation === account.relation)}
              />
            ))}
          </Group>
          <Group value="bride" title="신부측">
            {BRIDE_ACCOUNTS.map((account) => (
              <AccountRow
                key={account.relation}
                account={account}
                contact={BRIDE_CONTACTS.find((person) => person.relation === account.relation)}
              />
            ))}
          </Group>
        </Accordion>
      </div>
      {includePhotos && (
        <div className="mt-6">
          <GuestPhotosButton />
        </div>
      )}
    </Section>
  );
}
