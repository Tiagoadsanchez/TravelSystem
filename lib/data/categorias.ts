import { supabase } from "@/lib/supabaseClient";
import type { Categoria } from "@/lib/types";

export interface DatosCategoria {
  nombre: string;
  color: string | null;
}

export async function listarCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");
  return { data: (data as Categoria[] | null) ?? [], error };
}

export async function crearCategoria(datos: DatosCategoria) {
  return supabase.from("categorias").insert(datos);
}

export async function actualizarCategoria(id: string, datos: DatosCategoria) {
  return supabase.from("categorias").update(datos).eq("id", id);
}

export async function eliminarCategoria(id: string) {
  return supabase.from("categorias").delete().eq("id", id);
}
