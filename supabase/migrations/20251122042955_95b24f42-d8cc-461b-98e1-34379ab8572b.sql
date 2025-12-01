-- Buckets para conteúdos de aula e thumbnails
insert into storage.buckets (id, name, public)
values
  ('lesson-content', 'lesson-content', true),
  ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do nothing;

-- Políticas de leitura pública para esses buckets
create policy "Public read lesson content"
  on storage.objects
  for select
  using (bucket_id in ('lesson-content', 'course-thumbnails'));

-- Permitir upload (insert) para esses buckets
create policy "Public upload lesson content"
  on storage.objects
  for insert
  with check (bucket_id in ('lesson-content', 'course-thumbnails'));

-- Permitir update apenas em arquivos desses buckets
create policy "Public update lesson content"
  on storage.objects
  for update
  using (bucket_id in ('lesson-content', 'course-thumbnails'));

-- Permitir delete apenas em arquivos desses buckets
create policy "Public delete lesson content"
  on storage.objects
  for delete
  using (bucket_id in ('lesson-content', 'course-thumbnails'));
