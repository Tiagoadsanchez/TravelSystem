// Las fechas de la base vienen como "YYYY-MM-DD" (sin zona horaria).
// Todo se calcula en hora local para que "hoy" sea el día real de quien usa la app.

const pad = (n: number) => String(n).padStart(2, "0");

export function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function hoyISO(): string {
  return fechaISO(new Date());
}

export function fechaLocal(fecha: string): Date {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function diasEntre(desde: string, hasta: string): number {
  const a = fechaLocal(desde);
  const b = fechaLocal(hasta);
  const ms =
    Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
    Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  return Math.round(ms / 86400000);
}

export function sumarDias(fecha: string, n: number): string {
  const d = fechaLocal(fecha);
  d.setDate(d.getDate() + n);
  return fechaISO(d);
}

// Todas las fechas entre dos días, inclusive. El tope evita bucles enormes si hay datos mal cargados.
export function rangoFechas(desde: string, hasta: string, maximo = 366): string[] {
  const total = Math.min(diasEntre(desde, hasta) + 1, maximo);
  return Array.from({ length: Math.max(total, 0) }, (_, i) => sumarDias(desde, i));
}

function formatear(fecha: string, opciones: Intl.DateTimeFormatOptions): string {
  return fechaLocal(fecha).toLocaleDateString("es", opciones).replace(/[.,]/g, "");
}

export const diaSemanaCorto = (fecha: string) => formatear(fecha, { weekday: "short" });
export const mesCorto = (fecha: string) => formatear(fecha, { month: "short" });
export const diaDelMes = (fecha: string) => fechaLocal(fecha).getDate();

export function fechaCorta(fecha: string, conAnio = false): string {
  const anio = conAnio ? ` ${fechaLocal(fecha).getFullYear()}` : "";
  return `${diaDelMes(fecha)} ${mesCorto(fecha)}${anio}`;
}

export function fechaLarga(fecha: string): string {
  const texto = formatear(fecha, { weekday: "long", day: "numeric", month: "long" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function edad(nacimiento: string, referencia: string = hoyISO()): number {
  const n = fechaLocal(nacimiento);
  const r = fechaLocal(referencia);
  let anios = r.getFullYear() - n.getFullYear();
  const aunNoCumplio =
    r.getMonth() < n.getMonth() || (r.getMonth() === n.getMonth() && r.getDate() < n.getDate());
  if (aunNoCumplio) anios -= 1;
  return anios;
}

// "09:00:00" -> "09:00"
export function hora(valor: string | null): string {
  return valor ? valor.slice(0, 5) : "";
}
