"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarViajes } from "@/lib/data/viajes";
import type { Viaje } from "@/lib/types";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      setLoading(true);
      const { data, error } = await listarViajes();
      if (error) setError(error.message);
      else setViajes(data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  const hoy = hoyISO();
  const proximos = viajes.filter((v) => v.fecha_inicio > hoy);
  const enCurso = viajes.filter((v) => v.fecha_inicio <= hoy && v.fecha_fin >= hoy);
  const realizados = viajes.filter((v) => v.fecha_fin < hoy);

  return (
    <div>
      <h1>Inicio</h1>
      <p className="card-sub">Resumen de tus viajes.</p>

      {error && <p className="error">{error}</p>}
      {loading && <p className="empty">Cargando...</p>}

      {!loading && !error && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{proximos.length}</div>
            <div className="stat-label">Próximos viajes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{enCurso.length}</div>
            <div className="stat-label">En curso</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{realizados.length}</div>
            <div className="stat-label">Realizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{viajes.length}</div>
            <div className="stat-label">Total de viajes</div>
          </div>
        </div>
      )}

      <Link href="/viajes" className="btn-link">
        Ver todos los viajes →
      </Link>
    </div>
  );
}
