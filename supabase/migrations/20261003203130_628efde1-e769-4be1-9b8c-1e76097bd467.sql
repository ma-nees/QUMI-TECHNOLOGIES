revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
drop policy "open jobs public" on public.jobs;
create policy "open jobs anon" on public.jobs for select to anon using (is_open);
create policy "open jobs auth" on public.jobs for select to authenticated using (is_open or public.has_role(auth.uid(),'admin'));
drop policy "published posts public" on public.posts;
create policy "published posts anon" on public.posts for select to anon using (published);
create policy "published posts auth" on public.posts for select to authenticated using (published or public.has_role(auth.uid(),'admin'));