CREATE TABLE public.guest_photo_tags (name text PRIMARY KEY, category text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.guest_photo_tags TO service_role;
ALTER TABLE public.guest_photo_tags ENABLE ROW LEVEL SECURITY;