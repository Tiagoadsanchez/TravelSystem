-- ============================================================
-- Autenticación + Row Level Security para Planificador de Viajes
-- Ejecutar este script completo en Supabase → SQL Editor
-- ============================================================

-- 1. Vincular cada viaje a un usuario autenticado
alter table viajes
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

alter table viajes
  alter column user_id set default auth.uid();

-- 2. Activar RLS en todas las tablas
alter table viajes enable row level security;
alter table dias enable row level security;
alter table eventos enable row level security;
alter table checklist_items enable row level security;
alter table categorias enable row level security;

-- 3. Políticas para "viajes": cada usuario solo ve/edita los suyos
create policy "viajes_select_propios" on viajes
  for select using (auth.uid() = user_id);

create policy "viajes_insert_propios" on viajes
  for insert with check (auth.uid() = user_id);

create policy "viajes_update_propios" on viajes
  for update using (auth.uid() = user_id);

create policy "viajes_delete_propios" on viajes
  for delete using (auth.uid() = user_id);

-- 4. Políticas para "dias": a través del viaje al que pertenecen
create policy "dias_select_propios" on dias
  for select using (
    exists (select 1 from viajes where viajes.id = dias.viaje_id and viajes.user_id = auth.uid())
  );

create policy "dias_insert_propios" on dias
  for insert with check (
    exists (select 1 from viajes where viajes.id = dias.viaje_id and viajes.user_id = auth.uid())
  );

create policy "dias_update_propios" on dias
  for update using (
    exists (select 1 from viajes where viajes.id = dias.viaje_id and viajes.user_id = auth.uid())
  );

create policy "dias_delete_propios" on dias
  for delete using (
    exists (select 1 from viajes where viajes.id = dias.viaje_id and viajes.user_id = auth.uid())
  );

-- 5. Políticas para "eventos": a través de día → viaje
create policy "eventos_select_propios" on eventos
  for select using (
    exists (
      select 1 from dias
      join viajes on viajes.id = dias.viaje_id
      where dias.id = eventos.dia_id and viajes.user_id = auth.uid()
    )
  );

create policy "eventos_insert_propios" on eventos
  for insert with check (
    exists (
      select 1 from dias
      join viajes on viajes.id = dias.viaje_id
      where dias.id = eventos.dia_id and viajes.user_id = auth.uid()
    )
  );

create policy "eventos_update_propios" on eventos
  for update using (
    exists (
      select 1 from dias
      join viajes on viajes.id = dias.viaje_id
      where dias.id = eventos.dia_id and viajes.user_id = auth.uid()
    )
  );

create policy "eventos_delete_propios" on eventos
  for delete using (
    exists (
      select 1 from dias
      join viajes on viajes.id = dias.viaje_id
      where dias.id = eventos.dia_id and viajes.user_id = auth.uid()
    )
  );

-- 6. Políticas para "checklist_items": a través del viaje
create policy "checklist_select_propios" on checklist_items
  for select using (
    exists (select 1 from viajes where viajes.id = checklist_items.viaje_id and viajes.user_id = auth.uid())
  );

create policy "checklist_insert_propios" on checklist_items
  for insert with check (
    exists (select 1 from viajes where viajes.id = checklist_items.viaje_id and viajes.user_id = auth.uid())
  );

create policy "checklist_update_propios" on checklist_items
  for update using (
    exists (select 1 from viajes where viajes.id = checklist_items.viaje_id and viajes.user_id = auth.uid())
  );

create policy "checklist_delete_propios" on checklist_items
  for delete using (
    exists (select 1 from viajes where viajes.id = checklist_items.viaje_id and viajes.user_id = auth.uid())
  );

-- 7. Categorías: tabla compartida, de solo lectura para cualquier usuario autenticado
--    (si querés poder crear categorías nuevas desde el SQL Editor, alcanza con
--    correr los INSERT ahí, no necesitás una policy de insert para eso)
create policy "categorias_select_autenticados" on categorias
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- IMPORTANTE
-- ============================================================
-- Los viajes que ya existían (creados antes de este cambio) van a
-- quedar con user_id = NULL y van a dejar de ser visibles para
-- cualquiera, incluso vos. Para recuperarlos, después de crear tu
-- usuario (Authentication → Users → Add user), corré:
--
--   update viajes set user_id = 'TU-USER-ID-AQUI' where user_id is null;
--
-- Tu user_id aparece en Supabase → Authentication → Users, columna "UID".
-- ============================================================
