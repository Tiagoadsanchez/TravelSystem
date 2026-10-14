import { supabase } from "@/lib/supabaseClient";
import type { Gasto } from "@/lib/types";

export interface DatosGasto {
  viaje_id: string;
  descripcion: string;
  monto: number;
  moneda: string;
  fecha: string;
  categoria_id: string | null;
  pagado_por: string | null;
}

export async function listarGastos() {
  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false });
  // numeric puede llegar como texto según la configuración; lo normalizamos a número
  const gastos = ((data as Gasto[] | null) ?? []).map((g) => ({ ...g, monto: Number(g.monto) }));
  return { data: gastos, error };
}

export async function crearGasto(datos: DatosGasto) {
  return supabase.from("gastos").insert(datos);
}

export async function actualizarGasto(id: string, datos: DatosGasto) {
  return supabase.from("gastos").update(datos).eq("id", id);
}

export async function eliminarGasto(id: string) {
  return supabase.from("gastos").delete().eq("id", id);
}
