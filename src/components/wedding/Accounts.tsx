import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/wedding/Section";
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
  type Account,
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
        {account.toss && (
          <Button size="sm" variant="secondary" className="rounded-full" asChild>
            <a href={account.toss} target="_blank" rel="noreferrer">
              토스 송금
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export function Accounts() {
  return (
    <Section eyebrow="Gift" title="마음 전하실 곳">
      <p className="mb-5 text-center text-xs leading-relaxed text-muted-foreground">
        축하의 마음을 담아 축의금을 전달하실 수 있도록
        <br />
        계좌번호를 안내드립니다.
      </p>

      <Accordion type="single" collapsible className="space-y-3">
        <AccordionItem
          value="groom"
          className="soft-card overflow-hidden border-b-0 px-4"
        >
          <AccordionTrigger className="text-sm hover:no-underline">
            신랑측 계좌번호
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            {GROOM_ACCOUNTS.map((account) => (
              <AccountRow key={account.relation} account={account} />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="bride"
          className="soft-card overflow-hidden border-b-0 px-4"
        >
          <AccordionTrigger className="text-sm hover:no-underline">
            신부측 계좌번호
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            {BRIDE_ACCOUNTS.map((account) => (
              <AccountRow key={account.relation} account={account} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Section>
  );
}
