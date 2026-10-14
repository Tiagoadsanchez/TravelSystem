export const MONEDAS = ["ARS", "USD", "EUR", "BRL", "CLP", "UYU", "GBP"];

export function formatearMonto(monto: number, moneda: string): string {
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: moneda }).format(monto);
  } catch {
    // código de moneda que Intl no conoce
    return `${moneda} ${monto.toFixed(2)}`;
  }
}

// "1.250,50" o "1250.50" -> 1250.5 ; devuelve null si no es un número válido
export function parsearMonto(texto: string): number | null {
  const limpio = texto.trim().replace(/\s/g, "");
  if (!limpio) return null;
  let normalizado = limpio;
  if (limpio.includes(",")) {
    // "1.250,50": el punto separa miles y la coma los decimales
    normalizado = limpio.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) {
    // "1.250" o "1.250.000": puntos de miles, sin decimales
    normalizado = limpio.replace(/\./g, "");
  }
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}

export function totalesPorMoneda(items: { monto: number; moneda: string }[]) {
  const mapa = new Map<string, number>();
  for (const item of items) mapa.set(item.moneda, (mapa.get(item.moneda) ?? 0) + item.monto);
  return Array.from(mapa.entries())
    .map(([moneda, total]) => ({ moneda, total }))
    .sort((a, b) => a.moneda.localeCompare(b.moneda));
}
