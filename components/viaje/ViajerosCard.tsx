"use client";

import { Users } from "lucide-react";
import Avatar from "@/components/viajeros/Avatar";
import { edad } from "@/lib/dates";
import type { Viajero } from "@/lib/types";

interface ViajerosCardProps {
  viajeros: Viajero[]; // los que van en este viaje
  onGestionar: () => void;
  onVer: (viajero: Viajero) => void;
}

export default function ViajerosCard({ viajeros, onGestionar, onVer }: ViajerosCardProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Viajeros</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={onGestionar}
          aria-label="Elegir quién viaja"
          title="Elegir quién viaja"
        >
          <Users size={16} />
        </button>
      </div>

      {viajeros.length === 0 && <p className="empty">Todavía no asignaste a nadie a este viaje.</p>}

      {viajeros.map((v) => (
        <button type="button" className="persona-row" key={v.id} onClick={() => onVer(v)}>
          <Avatar nombre={v.nombre} />
          <span className="persona-info">
            <span className="persona-nombre">{v.nombre}</span>
            {v.fecha_nacimiento && <span className="persona-sub">{edad(v.fecha_nacimiento)} años</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
