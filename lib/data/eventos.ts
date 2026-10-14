import { supabase } from "@/lib/supabaseClient";

export interface DatosEvento {
  titulo: string;
  ubicacion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  categoria_id: string | null;
}

export async function crearEvento(diaId: string, datos: DatosEvento) {
  return supabase.from("eventos").insert({ dia_id: diaId, ...datos });
}

export async function actualizarEvento(eventoId: string, datos: DatosEvento) {
  return supabase.from("eventos").update(datos).eq("id", eventoId);
}

export async function actualizarNotasEvento(eventoId: string, notas: string | null) {
  return supabase.from("eventos").update({ notas }).eq("id", eventoId);
}

export async function eliminarEvento(eventoId: string) {
  return supabase.from("eventos").delete().eq("id", eventoId);
}
