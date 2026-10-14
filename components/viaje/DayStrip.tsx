"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { diaDelMes, diaSemanaCorto, mesCorto } from "@/lib/dates";
import type { Dia } from "@/lib/types";

interface DayStripProps {
  fechas: string[];
  diasPorFecha: Map<string, Dia>;
  selected: string | null;
  hoy: string;
  onSelect: (fecha: string) => void;
}

const MAX_PUNTOS = 3;

export default function DayStrip({ fechas, diasPorFecha, selected, hoy, onSelect }: DayStripProps) {
  const tira = useRef<HTMLDivElement>(null);
  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(false);

  const actualizarFlechas = useCallback(() => {
    const el = tira.current;
    if (!el) return;
    setPuedeIzquierda(el.scrollLeft > 2);
    setPuedeDerecha(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    actualizarFlechas();
    const el = tira.current;
    if (!el) return;
    const observador = new ResizeObserver(actualizarFlechas);
    observador.observe(el);
    return () => observador.disconnect();
  }, [actualizarFlechas, fechas.length]);

  // Al elegir un día, la tira lo centra.
  useEffect(() => {
    const elegido = tira.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    elegido?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  function mover(sentido: -1 | 1) {
    const el = tira.current;
    if (!el) return;
    el.scrollBy({ left: sentido * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="day-strip-wrap">
      <button
        type="button"
        className="strip-arrow"
        onClick={() => mover(-1)}
        disabled={!puedeIzquierda}
        aria-label="Días anteriores"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="day-strip" role="tablist" aria-label="Días del viaje" ref={tira} onScroll={actualizarFlechas}>
        {fechas.map((fecha) => {
          const seleccionado = fecha === selected;
          const cantidad = diasPorFecha.get(fecha)?.eventos.length ?? 0;
          const clases =
            "day-chip" +
            (seleccionado ? " selected" : "") +
            (fecha === hoy ? " today" : "") +
            (cantidad === 0 ? " vacio" : "");
          return (
            <button
              key={fecha}
              type="button"
              role="tab"
              aria-selected={seleccionado}
              className={clases}
              onClick={() => onSelect(fecha)}
            >
              <span className="dow">{diaSemanaCorto(fecha)}</span>
              <span className="num">{diaDelMes(fecha)}</span>
              <span className="mes">{mesCorto(fecha)}</span>
              <span className="dots" aria-label={`${cantidad} actividades`}>
                {Array.from({ length: Math.min(cantidad, MAX_PUNTOS) }).map((_, i) => (
                  <span className="dot" key={i} />
                ))}
                {cantidad > MAX_PUNTOS && <span className="dots-extra">+</span>}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="strip-arrow"
        onClick={() => mover(1)}
        disabled={!puedeDerecha}
        aria-label="Días siguientes"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
