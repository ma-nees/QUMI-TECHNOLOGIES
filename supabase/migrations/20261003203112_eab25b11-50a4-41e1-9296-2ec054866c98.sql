create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role public.app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.contact_submissions (id uuid primary key default gen_random_uuid(), name text not null, email text not null, company text, topic text, message text not null, created_at timestamptz not null default now());
grant insert on public.contact_submissions to anon, authenticated; grant select, delete on public.contact_submissions to authenticated; grant all on public.contact_submissions to service_role;
alter table public.contact_submissions enable row level security;
create policy "anyone can submit" on public.contact_submissions for insert to anon, authenticated with check (char_length(name) between 1 and 120 and char_length(email) between 3 and 255 and char_length(message) between 1 and 5000);
create policy "admins read" on public.contact_submissions for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete" on public.contact_submissions for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.jobs (id uuid primary key default gen_random_uuid(), title text not null, department text not null default 'Engineering', location text not null default 'Kathmandu, Nepal', employment_type text not null default 'Full-time', summary text not null default '', description text not null default '', is_open boolean not null default true, created_at timestamptz not null default now());
grant select on public.jobs to anon; grant select, insert, update, delete on public.jobs to authenticated; grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "open jobs public" on public.jobs for select to anon, authenticated using (is_open or public.has_role(auth.uid(),'admin'));
create policy "admins manage jobs" on public.jobs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.job_applications (id uuid primary key default gen_random_uuid(), job_id uuid references public.jobs(id) on delete set null, name text not null, email text not null, phone text, portfolio_url text, cover_letter text, resume_path text, created_at timestamptz not null default now());
grant insert on public.job_applications to anon, authenticated; grant select, delete on public.job_applications to authenticated; grant all on public.job_applications to service_role;
alter table public.job_applications enable row level security;
create policy "anyone can apply" on public.job_applications for insert to anon, authenticated with check (char_length(name) between 1 and 120 and char_length(email) between 3 and 255 and coalesce(char_length(cover_letter),0) <= 5000);
create policy "admins read apps" on public.job_applications for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete apps" on public.job_applications for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.posts (id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, excerpt text not null default '', body text not null default '', category text not null default 'Engineering', published boolean not null default false, published_at timestamptz, created_at timestamptz not null default now());
grant select on public.posts to anon; grant select, insert, update, delete on public.posts to authenticated; grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "published posts public" on public.posts for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "admins manage posts" on public.posts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "anyone uploads resumes" on storage.objects for insert to anon, authenticated with check (bucket_id='resumes' and (storage.foldername(name))[1]='applications');
create policy "admins read resumes" on storage.objects for select to authenticated using (bucket_id='resumes' and public.has_role(auth.uid(),'admin'));
create policy "admins delete resumes" on storage.objects for delete to authenticated using (bucket_id='resumes' and public.has_role(auth.uid(),'admin'));