-- ============================================================
-- Fase 3: viajeros (fichas de personas) y quién va en cada viaje
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

create table if not exists viajeros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null,
  email text,
  telefono text,
  fecha_nacimiento date,
  documento_tipo text,
  documento_numero text,
  contacto_emergencia text,
  notas text,
  creado_en timestamptz not null default now()
);

-- Qué viajeros van en cada viaje (un viajero puede ir en varios viajes)
create table if not exists viaje_viajeros (
  viaje_id uuid not null references viajes(id) on delete cascade,
  viajero_id uuid not null references viajeros(id) on delete cascade,
  primary key (viaje_id, viajero_id)
);

-- Permisos de tabla para usuarios logueados. Sin esto, la API responde
-- "permission denied for table ..." aunque las políticas RLS estén bien.
grant select, insert, update, delete on table public.viajeros to authenticated;
grant select, insert, delete on table public.viaje_viajeros to authenticated;

alter table viajeros enable row level security;
alter table viaje_viajeros enable row level security;

-- viajeros: cada usuario ve y edita solo los suyos
create policy "viajeros_select_propios" on viajeros
  for select using (auth.uid() = user_id);

create policy "viajeros_insert_propios" on viajeros
  for insert with check (auth.uid() = user_id);

create policy "viajeros_update_propios" on viajeros
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "viajeros_delete_propios" on viajeros
  for delete using (auth.uid() = user_id);

-- viaje_viajeros: solo si el viaje es tuyo (y, al asignar, el viajero también)
create policy "viaje_viajeros_select_propios" on viaje_viajeros
  for select using (
    exists (select 1 from viajes where viajes.id = viaje_viajeros.viaje_id and viajes.user_id = auth.uid())
  );

create policy "viaje_viajeros_insert_propios" on viaje_viajeros
  for insert with check (
    exists (select 1 from viajes where viajes.id = viaje_viajeros.viaje_id and viajes.user_id = auth.uid())
    and exists (select 1 from viajeros where viajeros.id = viaje_viajeros.viajero_id and viajeros.user_id = auth.uid())
  );

create policy "viaje_viajeros_delete_propios" on viaje_viajeros
  for delete using (
    exists (select 1 from viajes where viajes.id = viaje_viajeros.viaje_id and viajes.user_id = auth.uid())
  );
