function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  const primera = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primera + ultima).toUpperCase();
}

export default function Avatar({ nombre }: { nombre: string }) {
  return (
    <span className="avatar" aria-hidden="true">
      {iniciales(nombre)}
    </span>
  );
}
