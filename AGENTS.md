<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Personal invite links live at /i/$code (invitees table, read via get_invitee_name RPC); admin actions go through ADMIN_CODE-checked server functions in src/lib/admin.functions.ts — guests never read private tables directly.
- Uploaded wedding media is referenced through Lovable Assets pointers in a shared photo module so cover, film and gallery use the same source assets.
- RSVP validation and admin statistics use shared client-safe rules; submission revalidates inside a server function so side and attendance counts stay consistent.
- Photo administration uses paginated listing and bounded deletion batches so large collections never require a single unbounded server request.
- Human-readable invitations use /to-$slug on the existing site; custom domains require verified ownership and connection rather than fabricated URLs.
- Normal section order is centralized in day-mode; accounts and contacts reuse Accounts with separate section variants, and normal-mode photo upload stays under Contact to preserve the specified order without removing uploads.
