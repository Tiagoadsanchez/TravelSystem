import { supabase } from "@/lib/supabaseClient";
import type { Categoria } from "@/lib/types";

export async function listarCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre");
  return { data: (data as Categoria[] | null) ?? [], error };
}
