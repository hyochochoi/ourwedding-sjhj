ALTER TABLE public.rsvp_submissions ADD COLUMN reminder_consent boolean NOT NULL DEFAULT false;
REVOKE EXECUTE ON FUNCTION public.get_guestbook_stars() FROM anon, authenticated, public;
ALTER TABLE public.guestbook_messages ALTER COLUMN content SET DEFAULT '';