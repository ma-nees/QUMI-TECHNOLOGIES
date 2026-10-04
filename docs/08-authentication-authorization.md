# 08 — Authentication & Authorization
- Email/password sign-in at `/auth` (staff only; no public sign-up link in navigation).
- `/admin` lives under the managed `_authenticated` layout (client-only gate).
- Admin rights = row in `user_roles` with role `admin`, granted by an existing admin/operator in Cloud → Database. Never stored on profiles or in client storage.
- Non-admin signed-in users see an "access not granted" message; RLS blocks data regardless.
