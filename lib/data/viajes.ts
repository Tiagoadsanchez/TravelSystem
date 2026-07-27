import { supabase } from "@/lib/supabaseClient";
import type { Viaje } from "@/lib/types";

export interface DatosViaje {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export async function listarViajes() {
  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .order("fecha_inicio", { ascending: true });
  return { data: data as Viaje[] | null, error };
}

export async function obtenerViaje(id: string) {
  const { data, error } = await supabase
    .from("viajes")
    .select("*")
    .eq("id", id)
    .single();
  return { data: data as Viaje | null, error };
}

export async function crearViaje(datos: DatosViaje) {
  return supabase.from("viajes").insert(datos);
}

export async function actualizarViaje(id: string, datos: DatosViaje) {
  return supabase.from("viajes").update(datos).eq("id", id);
}

export async function eliminarViaje(id: string) {
  return supabase.from("viajes").delete().eq("id", id);
}
