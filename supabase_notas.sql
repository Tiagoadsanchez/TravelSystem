-- ============================================================
-- Fase 2: notas del viaje, del día y de cada actividad
-- Ejecutar en Supabase → SQL Editor
-- ============================================================
-- Es una columna de texto por tabla. Las políticas RLS que ya existen
-- (por fila) cubren estas columnas, no hace falta tocar nada más.

alter table viajes add column if not exists notas text;
alter table dias add column if not exists notas text;
alter table eventos add column if not exists notas text;
