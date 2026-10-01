CREATE TABLE public.rsvp_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  side text NOT NULL,
  name text NOT NULL,
  phone text,
  attendance text NOT NULL,
  guest_count integer NOT NULL DEFAULT 1,
  companion text,
  meal_preference text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.rsvp_submissions TO anon, authenticated;
GRANT ALL ON public.rsvp_submissions TO service_role;
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit rsvp" ON public.rsvp_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.guestbook_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  content text NOT NULL,
  color_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.guestbook_messages TO anon, authenticated;
GRANT ALL ON public.guestbook_messages TO service_role;
ALTER TABLE public.guestbook_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read guestbook" ON public.guestbook_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can write guestbook" ON public.guestbook_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.qna_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  question text NOT NULL,
  answer text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.qna_questions TO anon, authenticated;
GRANT ALL ON public.qna_questions TO service_role;
ALTER TABLE public.qna_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read qna" ON public.qna_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can ask" ON public.qna_questions FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.guestbook_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.qna_questions;