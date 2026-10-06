import { useEffect, useState } from "react";
import { InvitationPage } from "@/components/wedding/InvitationPage";
import { supabase } from "@/integrations/supabase/client";

export function PersonalInvitation({ code }: { code: string }) {
  const [name, setName] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    void supabase.rpc("get_invitee_name", { _code: code.toLowerCase() }).then(({ data }) => {
      if (active) setName((data as string | null) ?? null);
    });
    return () => {
      active = false;
    };
  }, [code]);

  if (name === undefined) return <div className="dotted-bg min-h-screen" />;
  return <InvitationPage guestName={name} />;
}
