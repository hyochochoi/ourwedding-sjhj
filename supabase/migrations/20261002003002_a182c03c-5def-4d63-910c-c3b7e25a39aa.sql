ALTER TABLE public.guestbook_messages
  ADD COLUMN star_type text NOT NULL DEFAULT 'star',
  ADD COLUMN pos_x real NOT NULL DEFAULT 50,
  ADD COLUMN pos_y real NOT NULL DEFAULT 50;

DROP POLICY IF EXISTS "Anyone can read guestbook" ON public.guestbook_messages;
REVOKE SELECT ON public.guestbook_messages FROM anon, authenticated;
GRANT ALL ON public.guestbook_messages TO service_role;

CREATE OR REPLACE FUNCTION public.get_guestbook_stars()
RETURNS TABLE (id uuid, star_type text, pos_x real, pos_y real, color_index integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, star_type, pos_x, pos_y, color_index
  FROM public.guestbook_messages
  ORDER BY created_at ASC
  LIMIT 2000
$$;
GRANT EXECUTE ON FUNCTION public.get_guestbook_stars() TO anon, authenticated;

CREATE TABLE public.invitees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.invitees TO service_role;
ALTER TABLE public.invitees ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_invitee_name(_code text)
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT name FROM public.invitees WHERE code = _code LIMIT 1 $$;
GRANT EXECUTE ON FUNCTION public.get_invitee_name(text) TO anon, authenticated;

CREATE POLICY "Anyone can upload guest photos"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'guest-photos');