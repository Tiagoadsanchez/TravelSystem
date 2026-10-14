"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarViajes } from "@/lib/data/viajes";
import { diasEntre, fechaCorta, hoyISO } from "@/lib/dates";
import type { Viaje } from "@/lib/types";

function textoCuentaRegresiva(dias: number): string {
  if (dias === 1) return "mañana";
  return `faltan ${dias} días`;
}

export default function Inicio() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      const { data, error } = await listarViajes();
      if (error) setError(error.message);
      else setViajes(data ?? []);
      setLoading(false);
    }
    cargar();
  }, []);

  const hoy = hoyISO();
  const proximos = viajes.filter((v) => v.fecha_inicio > hoy);
  const enCurso = viajes.filter((v) => v.fecha_inicio <= hoy && v.fecha_fin >= hoy);
  const realizados = viajes.filter((v) => v.fecha_fin < hoy);

  // viajes viene ordenado por fecha de inicio: el primero de cada lista es el más cercano
  const destacado = enCurso[0] ?? proximos[0] ?? null;

  let etiqueta = "";
  let detalle = "";
  let progreso: number | null = null;

  if (destacado) {
    const rango = `${fechaCorta(destacado.fecha_inicio, true)} → ${fechaCorta(destacado.fecha_fin, true)}`;
    if (destacado.fecha_inicio <= hoy) {
      const total = diasEntre(destacado.fecha_inicio, destacado.fecha_fin) + 1;
      const actual = diasEntre(destacado.fecha_inicio, hoy) + 1;
      etiqueta = "En curso ahora";
      detalle = `Día ${actual} de ${total} · ${rango}`;
      progreso = (actual / total) * 100;
    } else {
      etiqueta = "Tu próximo destino";
      detalle = `${textoCuentaRegresiva(diasEntre(hoy, destacado.fecha_inicio))} · ${rango}`;
    }
  }

  return (
    <div>
      <h1>Inicio</h1>
      <p className="card-sub">Tu cuaderno de viajes.</p>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Cargando...</p>}

      {!loading && !error && destacado && (
        <Link href={`/viaje/${destacado.id}`} className="hero">
          <div className="hero-label">{etiqueta}</div>
          <div className="hero-title">{destacado.nombre}</div>
          <div className="hero-meta">{detalle}</div>
          {progreso !== null && (
            <div className="hero-progress" aria-hidden="true">
              <div style={{ width: `${progreso}%` }} />
            </div>
          )}
        </Link>
      )}

      {!loading && !error && !destacado && (
        <div className="hero hero-empty">
          <div className="hero-title">Todavía no tenés viajes por delante</div>
          <div className="hero-meta">Armá el próximo y empezá a llenar tu agenda.</div>
        </div>
      )}

      {!loading && !error && (
        <div className="chip-row">
          <span className="chip">
            <strong>{proximos.length}</strong> próximos
          </span>
          <span className="chip">
            <strong>{enCurso.length}</strong> en curso
          </span>
          <span className="chip">
            <strong>{realizados.length}</strong> realizados
          </span>
          <span className="chip">
            <strong>{viajes.length}</strong> en total
          </span>
        </div>
      )}

      <p style={{ marginTop: 20 }}>
        <Link href="/viajes" className="btn-link">
          Ver todos los viajes →
        </Link>
      </p>
    </div>
  );
}
