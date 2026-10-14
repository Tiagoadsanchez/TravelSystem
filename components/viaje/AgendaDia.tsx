"use client";

import { NotebookPen, Pencil, Plus, StickyNote, Trash2 } from "lucide-react";
import { fechaLarga, hora } from "@/lib/dates";
import type { Dia, Evento } from "@/lib/types";

interface AgendaDiaProps {
  dia: Dia;
  onAddEvento: () => void;
  onEditEvento: (evento: Evento) => void;
  onDeleteEvento: (evento: Evento) => void;
  onNotaEvento: (evento: Evento) => void;
  onEditDia: () => void;
  onDeleteDia: () => void;
}

export default function AgendaDia({
  dia,
  onAddEvento,
  onEditEvento,
  onDeleteEvento,
  onNotaEvento,
  onEditDia,
  onDeleteDia,
}: AgendaDiaProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">
          {fechaLarga(dia.fecha)}
          {dia.titulo ? ` · ${dia.titulo}` : ""}
        </h2>
        <div className="row-actions">
          <button type="button" className="icon-btn" onClick={onEditDia} aria-label="Editar día" title="Editar día">
            <Pencil size={16} />
          </button>
          <button type="button" className="icon-btn" onClick={onDeleteDia} aria-label="Eliminar día" title="Eliminar día">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {dia.eventos.length === 0 && (
        <p className="empty">Sin actividades para este día todavía.</p>
      )}

      {dia.eventos.map((evento) => (
        <div className="timeline-row" key={evento.id}>
          <div className="timeline-hora">
            <div>{hora(evento.hora_inicio) || "--:--"}</div>
            {evento.hora_fin && <div className="timeline-hora-fin">{hora(evento.hora_fin)}</div>}
          </div>
          <span
            className="timeline-bar"
            style={{ backgroundColor: evento.categorias?.color || "#9bb5b8" }}
            title={evento.categorias?.nombre ?? "Sin categoría"}
          />
          <div className="timeline-info">
            <div className="timeline-titulo">{evento.titulo}</div>
            {evento.ubicacion && <div className="timeline-sub">{evento.ubicacion}</div>}
            {evento.notas && (
              <div className="timeline-nota">
                <StickyNote size={12} aria-hidden="true" />
                <span>{evento.notas}</span>
              </div>
            )}
          </div>
          <div className="row-actions">
            <button
              type="button"
              className={"icon-btn" + (evento.notas ? " has-nota" : "")}
              onClick={() => onNotaEvento(evento)}
              aria-label={evento.notas ? "Ver o editar nota" : "Agregar nota"}
              title={evento.notas ? "Ver o editar nota" : "Agregar nota"}
            >
              <NotebookPen size={16} />
            </button>
            <button type="button" className="icon-btn" onClick={() => onEditEvento(evento)} aria-label="Editar actividad" title="Editar actividad">
              <Pencil size={16} />
            </button>
            <button type="button" className="icon-btn" onClick={() => onDeleteEvento(evento)} aria-label="Eliminar actividad" title="Eliminar actividad">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={onAddEvento}>
        <Plus size={16} aria-hidden="true" />
        Agregar actividad
      </button>
    </div>
  );
}
