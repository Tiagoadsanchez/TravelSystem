import { supabase } from "@/lib/supabaseClient";
import type { Dia } from "@/lib/types";

export async function listarDiasConEventos(viajeId: string) {
  const { data, error } = await supabase
    .from("dias")
    .select("*, eventos(*, categorias(*))")
    .eq("viaje_id", viajeId)
    .order("fecha", { ascending: true });

  if (error || !data) return { data: null, error };

  // Las actividades sin hora van al final del día.
  const diasOrdenados = (data as Dia[]).map((dia) => ({
    ...dia,
    eventos: [...dia.eventos].sort((a, b) =>
      (a.hora_inicio ?? "99:99").localeCompare(b.hora_inicio ?? "99:99")
    ),
  }));

  return { data: diasOrdenados, error: null };
}

export async function crearDia(viajeId: string, fecha: string, titulo: string | null) {
  const { data, error } = await supabase
    .from("dias")
    .insert({ viaje_id: viajeId, fecha, titulo })
    .select("id")
    .single();
  return { data: data as { id: string } | null, error };
}

export async function actualizarDia(diaId: string, titulo: string | null) {
  return supabase.from("dias").update({ titulo }).eq("id", diaId);
}

export async function actualizarNotasDia(diaId: string, notas: string | null) {
  return supabase.from("dias").update({ notas }).eq("id", diaId);
}

export async function eliminarDia(diaId: string) {
  return supabase.from("dias").delete().eq("id", diaId);
}
