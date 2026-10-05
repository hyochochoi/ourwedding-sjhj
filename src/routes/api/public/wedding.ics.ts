import { createFileRoute } from "@tanstack/react-router";
import { buildIcs } from "@/lib/calendar";

/** iOS 사파리·안드로이드에서 바로 "캘린더에 추가"가 뜨도록 text/calendar로 내려줍니다. */
export const Route = createFileRoute("/api/public/wedding/ics")({
  server: {
    handlers: {
      GET: async () =>
        new Response(buildIcs(), {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'inline; filename="wedding.ics"',
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
