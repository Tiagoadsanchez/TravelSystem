export interface Viaje {
  id: string;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  notas: string | null;
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
  notas: string | null;
}

export interface Dia {
  id: string;
  viaje_id: string;
  fecha: string;
  titulo: string | null;
  notas: string | null;
  eventos: Evento[];
}

export interface Viajero {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  documento_tipo: string | null;
  documento_numero: string | null;
  contacto_emergencia: string | null;
  notas: string | null;
}

export interface Gasto {
  id: string;
  viaje_id: string;
  descripcion: string;
  monto: number;
  moneda: string;
  fecha: string;
  categoria_id: string | null;
  pagado_por: string | null;
}

export interface ChecklistItem {
  id: string;
  viaje_id: string;
  descripcion: string;
  completado: boolean;
}
