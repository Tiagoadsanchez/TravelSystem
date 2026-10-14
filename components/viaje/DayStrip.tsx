"use client";

import { Plus } from "lucide-react";
import { diaDelMes, diaSemanaCorto, mesCorto } from "@/lib/dates";
import type { Dia } from "@/lib/types";

interface DayStripProps {
  dias: Dia[];
  selectedId: string | null;
  hoy: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

const MAX_PUNTOS = 3;

export default function DayStrip({ dias, selectedId, hoy, onSelect, onAdd }: DayStripProps) {
  return (
    <div className="day-strip" role="tablist" aria-label="Días del viaje">
      {dias.map((dia) => {
        const seleccionado = dia.id === selectedId;
        const cantidad = dia.eventos.length;
        const clases =
          "day-chip" + (seleccionado ? " selected" : "") + (dia.fecha === hoy ? " today" : "");
        return (
          <button
            key={dia.id}
            type="button"
            role="tab"
            aria-selected={seleccionado}
            className={clases}
            onClick={() => onSelect(dia.id)}
          >
            <span className="dow">{diaSemanaCorto(dia.fecha)}</span>
            <span className="num">{diaDelMes(dia.fecha)}</span>
            <span className="mes">{mesCorto(dia.fecha)}</span>
            <span className="dots" aria-label={`${cantidad} actividades`}>
              {Array.from({ length: Math.min(cantidad, MAX_PUNTOS) }).map((_, i) => (
                <span className="dot" key={i} />
              ))}
              {cantidad > MAX_PUNTOS && <span className="dots-extra">+</span>}
            </span>
          </button>
        );
      })}
      <button type="button" className="day-chip day-chip-add" onClick={onAdd} aria-label="Agregar día">
        <Plus size={20} aria-hidden="true" />
        <span className="mes">Día</span>
      </button>
    </div>
  );
}
