import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { InvitationPage } from "@/components/wedding/InvitationPage";
import { supabase } from "@/integrations/supabase/client";

const TITLE = "이상진 · 최효정 결혼식에 초대합니다";
const DESCRIPTION =
  "당신을 위한 청첩장이 도착했어요. 2027년 3월 14일 오후 1시, 일산 웨스턴빌리프.";

export const Route = createFileRoute("/i/$code")({
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
  component: PersonalInvitation,
});

function PersonalInvitation() {
  const { code } = Route.useParams();
  const [name, setName] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void supabase.rpc("get_invitee_name", { _code: code }).then(({ data }) => {
      if (active) setName((data as string | null) ?? null);
    });
    return () => {
      active = false;
    };
  }, [code]);

  if (name === undefined) {
    return <div className="dotted-bg min-h-screen" />;
  }
  return <InvitationPage guestName={name} />;
}
