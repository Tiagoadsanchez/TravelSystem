import { supabase } from "@/lib/supabaseClient";
import type { Dia } from "@/lib/types";

export async function listarDiasConEventos(viajeId: string) {
  const { data, error } = await supabase
    .from("dias")
    .select("*, eventos(*, categorias(*))")
    .eq("viaje_id", viajeId)
    .order("fecha", { ascending: true });

  if (error || !data) return { data: null, error };

  const diasOrdenados = (data as Dia[]).map((dia) => ({
    ...dia,
    eventos: [...dia.eventos].sort((a, b) =>
      (a.hora_inicio || "").localeCompare(b.hora_inicio || "")
    ),
  }));

  return { data: diasOrdenados, error: null };
}

export async function crearDia(viajeId: string, fecha: string, titulo: string | null) {
  return supabase.from("dias").insert({ viaje_id: viajeId, fecha, titulo });
}

export async function actualizarDia(diaId: string, titulo: string | null) {
  return supabase.from("dias").update({ titulo }).eq("id", diaId);
}

export async function eliminarDia(diaId: string) {
  return supabase.from("dias").delete().eq("id", diaId);
}
