"use client";

import { Pencil, Trash2 } from "lucide-react";
import { fechaCorta } from "@/lib/dates";
import { formatearMonto } from "@/lib/dinero";
import type { Categoria, Gasto } from "@/lib/types";

interface GastoRowProps {
  gasto: Gasto;
  viajeNombre: string | null; // null = no mostrar (ya filtrado por viaje)
  categoria: Categoria | null;
  pagador: string | null;
  onEditar: () => void;
  onEliminar: () => void;
}

const COLOR_SIN_CATEGORIA = "#9bb5b8";

export default function GastoRow({
  gasto,
  viajeNombre,
  categoria,
  pagador,
  onEditar,
  onEliminar,
}: GastoRowProps) {
  const detalles = [
    fechaCorta(gasto.fecha, true),
    viajeNombre,
    categoria?.nombre ?? null,
    pagador ? `Pagó ${pagador}` : null,
  ].filter(Boolean);

  return (
    <div className="timeline-row">
      <span
        className="timeline-bar"
        style={{ backgroundColor: categoria?.color || COLOR_SIN_CATEGORIA }}
        title={categoria?.nombre ?? "Sin categoría"}
      />
      <div className="timeline-info">
        <div className="timeline-titulo">{gasto.descripcion}</div>
        <div className="timeline-sub">{detalles.join(" · ")}</div>
      </div>
      <div className="gasto-monto">{formatearMonto(gasto.monto, gasto.moneda)}</div>
      <div className="row-actions">
        <button type="button" className="icon-btn" onClick={onEditar} aria-label={`Editar ${gasto.descripcion}`} title="Editar">
          <Pencil size={16} />
        </button>
        <button type="button" className="icon-btn" onClick={onEliminar} aria-label={`Eliminar ${gasto.descripcion}`} title="Eliminar">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
