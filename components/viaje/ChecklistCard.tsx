"use client";

import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import type { ChecklistItem } from "@/lib/types";

interface ChecklistCardProps {
  items: ChecklistItem[];
  onToggle: (item: ChecklistItem) => void;
  onDelete: (item: ChecklistItem) => void;
  onAdd: (descripcion: string) => Promise<void>;
}

export default function ChecklistCard({ items, onToggle, onDelete, onAdd }: ChecklistCardProps) {
  const [nuevo, setNuevo] = useState("");

  async function agregar(e: FormEvent) {
    e.preventDefault();
    const texto = nuevo.trim();
    if (!texto) return;
    await onAdd(texto);
    setNuevo("");
  }

  const hechos = items.filter((i) => i.completado).length;

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Checklist</h2>
        {items.length > 0 && (
          <span className="card-sub">
            {hechos} de {items.length}
          </span>
        )}
      </div>

      {items.length === 0 && <p className="empty">Todavía no agregaste nada.</p>}

      {items.map((item) => (
        <div className="checklist-item" key={item.id}>
          <label className="checklist-label">
            <input type="checkbox" checked={item.completado} onChange={() => onToggle(item)} />
            <span className={item.completado ? "tachado" : ""}>{item.descripcion}</span>
          </label>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onDelete(item)}
            aria-label={`Eliminar ${item.descripcion}`}
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <form className="form-plain checklist-add" onSubmit={agregar}>
        <input
          type="text"
          placeholder="Ej: Llevar cargador portátil"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          aria-label="Nuevo ítem"
        />
        <button type="submit">Agregar</button>
      </form>
    </div>
  );
}
