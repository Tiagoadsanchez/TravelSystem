-- ============================================================
-- Permitir crear/editar/borrar categorías desde la app
-- Ejecutar en Supabase → SQL Editor
-- ============================================================
-- Categorías es una tabla compartida (no tiene user_id), así que
-- cualquier usuario autenticado puede administrarla.

create policy "categorias_insert_autenticados" on categorias
  for insert with check (auth.role() = 'authenticated');

create policy "categorias_update_autenticados" on categorias
  for update using (auth.role() = 'authenticated');

create policy "categorias_delete_autenticados" on categorias
  for delete using (auth.role() = 'authenticated');
