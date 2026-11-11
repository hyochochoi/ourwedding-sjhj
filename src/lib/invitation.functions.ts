import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getInviteeName = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ code: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: name, error } = await supabase.rpc("get_invitee_name", {
      _code: data.code.toLowerCase(),
    });
    if (error) throw new Error(error.message);
    return name?.trim() || null;
  });
