export interface Viaje {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  color: string | null;
}

export interface Evento {
  id: string;
  dia_id: string;
  titulo: string;
  ubicacion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  categoria_id: string | null;
  categorias: Categoria | null;
}

export interface Dia {
  id: string;
  viaje_id: string;
  fecha: string;
  titulo: string | null;
  eventos: Evento[];
}

export interface ChecklistItem {
  id: string;
  viaje_id: string;
  descripcion: string;
  completado: boolean;
}
