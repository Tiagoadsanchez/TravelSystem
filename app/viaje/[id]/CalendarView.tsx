"use client";

import { Calendar, dateFnsLocalizer, type EventPropGetter } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { es } from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Dia } from "@/lib/types";

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

// Combina la fecha del día con la hora del evento en un objeto Date real
function combinarFechaHora(fecha: string, hora: string | null, horaPorDefecto: string) {
  const horaFinal = hora || horaPorDefecto;
  return new Date(`${fecha}T${horaFinal}`);
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

export default function CalendarView({ dias }: { dias: Dia[] }) {
  const eventos: CalendarEvent[] = dias.flatMap((dia) =>
    dia.eventos.map((evento) => ({
      id: evento.id,
      title: evento.titulo,
      start: combinarFechaHora(dia.fecha, evento.hora_inicio, "09:00:00"),
      end: combinarFechaHora(
        dia.fecha,
        evento.hora_fin || evento.hora_inicio,
        "10:00:00"
      ),
      color: evento.categorias?.color || "#3b82f6",
    }))
  );

  return (
    <div style={{ height: 600, marginBottom: 32 }}>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        culture="es"
        messages={{
          next: "Sig.",
          previous: "Ant.",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          noEventsInRange: "No hay actividades en este rango.",
        }}
        eventPropGetter={((event: CalendarEvent) => ({
          style: {
            backgroundColor: event.color,
            borderRadius: "4px",
            border: "none",
          },
        })) as EventPropGetter<CalendarEvent>}
      />
    </div>
  );
}
