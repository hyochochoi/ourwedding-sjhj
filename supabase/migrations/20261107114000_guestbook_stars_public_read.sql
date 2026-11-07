REVOKE EXECUTE ON FUNCTION public.get_guestbook_stars() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_guestbook_stars() TO anon, authenticated;
