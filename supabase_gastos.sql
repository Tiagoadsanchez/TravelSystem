-- ============================================================
-- Fase 4: gastos de los viajes
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

create table if not exists gastos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  viaje_id uuid not null references viajes(id) on delete cascade,
  descripcion text not null,
  monto numeric(14, 2) not null check (monto >= 0),
  moneda text not null default 'ARS',
  fecha date not null default current_date,
  pagado_por uuid references viajeros(id) on delete set null,
  creado_en timestamptz not null default now()
);

-- La categoría usa el mismo tipo de id que tu tabla "categorias", sea cual sea.
do $$
declare tipo text;
begin
  select format_type(a.atttypid, a.atttypmod) into tipo
  from pg_attribute a
  where a.attrelid = 'public.categorias'::regclass and a.attname = 'id';

  execute format(
    'alter table public.gastos add column if not exists categoria_id %s references public.categorias(id) on delete set null',
    tipo
  );
end $$;

grant select, insert, update, delete on table public.gastos to authenticated;

alter table gastos enable row level security;

create policy "gastos_select_propios" on gastos
  for select using (auth.uid() = user_id);

create policy "gastos_insert_propios" on gastos
  for insert with check (
    auth.uid() = user_id
    and exists (select 1 from viajes where viajes.id = gastos.viaje_id and viajes.user_id = auth.uid())
  );

create policy "gastos_update_propios" on gastos
  for update using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from viajes where viajes.id = gastos.viaje_id and viajes.user_id = auth.uid())
  );

create policy "gastos_delete_propios" on gastos
  for delete using (auth.uid() = user_id);
