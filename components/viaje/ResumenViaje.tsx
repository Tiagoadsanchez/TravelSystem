"use client";

import { fechaCorta } from "@/lib/dates";
import type { Categoria, ChecklistItem, Dia } from "@/lib/types";

interface ResumenViajeProps {
  fechas: string[]; // todas las fechas del viaje, tengan o no actividades
  dias: Dia[];
  categorias: Categoria[];
  checklist: ChecklistItem[];
}

const COLOR_SIN_CATEGORIA = "#9bb5b8";
const MAX_DIAS_VACIOS = 12;

export default function ResumenViaje({ fechas, dias, categorias, checklist }: ResumenViajeProps) {
  const eventos = dias.flatMap((d) => d.eventos);
  const conActividades = new Set(dias.filter((d) => d.eventos.length > 0).map((d) => d.fecha));
  const diasConPlan = fechas.filter((f) => conActividades.has(f)).length;
  const diasVacios = fechas.filter((f) => !conActividades.has(f));
  const checklistHechos = checklist.filter((i) => i.completado).length;

  const conteo = new Map<string, number>();
  for (const e of eventos) {
    const clave = e.categoria_id ?? "";
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }
  const filas = Array.from(conteo.entries())
    .map(([clave, cantidad]) => {
      const cat = categorias.find((c) => c.id === clave);
      return {
        clave,
        cantidad,
        nombre: cat?.nombre ?? "Sin categoría",
        color: cat?.color || COLOR_SIN_CATEGORIA,
      };
    })
    .sort((a, b) => b.cantidad - a.cantidad);
  const maximo = filas[0]?.cantidad ?? 1;

  return (
    <div>
      <div className="metric-grid">
        <div className="metric">
          <div className="metric-value">{eventos.length}</div>
          <div className="metric-label">Actividades</div>
        </div>
        <div className="metric">
          <div className="metric-value">
            {diasConPlan}
            <span className="metric-of"> de {fechas.length}</span>
          </div>
          <div className="metric-label">Días con plan</div>
        </div>
        <div className="metric">
          <div className="metric-value">
            {checklistHechos}
            <span className="metric-of"> de {checklist.length}</span>
          </div>
          <div className="metric-label">Checklist completado</div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h2 className="panel-title">Actividades por categoría</h2>
        {filas.length === 0 && <p className="empty">Todavía no hay actividades cargadas.</p>}
        {filas.map((fila) => (
          <div className="cat-bar-row" key={fila.clave}>
            <span className="cat-bar-label">{fila.nombre}</span>
            <span className="cat-bar-track">
              <span
                className="cat-bar-fill"
                style={{ width: `${(fila.cantidad / maximo) * 100}%`, backgroundColor: fila.color }}
              />
            </span>
            <span className="cat-bar-count">{fila.cantidad}</span>
          </div>
        ))}
      </div>

      <div className="panel" style={{ marginTop: 16 }}>
        <h2 className="panel-title">Días sin actividades</h2>
        {diasVacios.length === 0 && <p className="empty">Todos tus días tienen plan.</p>}
        {diasVacios.length > 0 && (
          <div className="chip-row">
            {diasVacios.slice(0, MAX_DIAS_VACIOS).map((fecha) => (
              <span className="chip" key={fecha}>
                {fechaCorta(fecha)}
              </span>
            ))}
            {diasVacios.length > MAX_DIAS_VACIOS && (
              <span className="chip">+{diasVacios.length - MAX_DIAS_VACIOS} más</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
