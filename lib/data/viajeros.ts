import { supabase } from "@/lib/supabaseClient";
import type { Viajero } from "@/lib/types";

export interface DatosViajero {
  nombre: string;
  email: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  documento_tipo: string | null;
  documento_numero: string | null;
  contacto_emergencia: string | null;
  notas: string | null;
}

type Resultado = { error: { message: string } | null };

export async function listarViajeros() {
  const { data, error } = await supabase.from("viajeros").select("*").order("nombre");
  return { data: (data as Viajero[] | null) ?? [], error };
}

export async function crearViajero(datos: DatosViajero) {
  return supabase.from("viajeros").insert(datos);
}

export async function actualizarViajero(id: string, datos: DatosViajero) {
  return supabase.from("viajeros").update(datos).eq("id", id);
}

export async function eliminarViajero(id: string) {
  return supabase.from("viajeros").delete().eq("id", id);
}

// ids de los viajeros que van en un viaje
export async function listarIdsViajerosDeViaje(viajeId: string) {
  const { data, error } = await supabase
    .from("viaje_viajeros")
    .select("viajero_id")
    .eq("viaje_id", viajeId);
  const filas = (data as { viajero_id: string }[] | null) ?? [];
  return { data: filas.map((f) => f.viajero_id), error };
}

// Deja en el viaje exactamente a los viajeros indicados (agrega y quita lo que haga falta).
export async function asignarViajeros(
  viajeId: string,
  nuevos: string[],
  actuales: string[]
): Promise<Resultado> {
  const agregar = nuevos.filter((id) => !actuales.includes(id));
  const quitar = actuales.filter((id) => !nuevos.includes(id));

  if (quitar.length > 0) {
    const res = await supabase
      .from("viaje_viajeros")
      .delete()
      .eq("viaje_id", viajeId)
      .in("viajero_id", quitar);
    if (res.error) return res;
  }
  if (agregar.length > 0) {
    return supabase
      .from("viaje_viajeros")
      .insert(agregar.map((viajero_id) => ({ viaje_id: viajeId, viajero_id })));
  }
  return { error: null };
}
