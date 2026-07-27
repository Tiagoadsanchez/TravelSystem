import { supabase } from "@/lib/supabaseClient";
import type { ChecklistItem } from "@/lib/types";

export async function listarChecklist(viajeId: string) {
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("viaje_id", viajeId)
    .order("id", { ascending: true });
  return { data: (data as ChecklistItem[] | null) ?? [], error };
}

export async function agregarItemChecklist(viajeId: string, descripcion: string) {
  return supabase.from("checklist_items").insert({ viaje_id: viajeId, descripcion });
}

export async function actualizarItemChecklist(itemId: string, completado: boolean) {
  return supabase.from("checklist_items").update({ completado }).eq("id", itemId);
}

export async function eliminarItemChecklist(itemId: string) {
  return supabase.from("checklist_items").delete().eq("id", itemId);
}
