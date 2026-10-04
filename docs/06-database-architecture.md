# 06 — Database Architecture

| Table | Purpose | Public access |
|---|---|---|
| `user_roles` (user_id, role app_role) | Role assignments | none |
| `contact_submissions` | Enquiries | insert only |
| `jobs` | Job postings (`is_open`) | select where open |
| `job_applications` | Applications + CV path | insert only |
| `posts` | Insights (`published`, `slug`) | select where published |

`has_role(uuid, app_role)` SECURITY DEFINER function used in all admin policies. Admins have full CRUD on content tables and SELECT/DELETE on submissions.
