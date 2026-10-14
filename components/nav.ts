import { House, Map, Tag, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // rutas extra que también marcan este ítem como activo (ej: el detalle de un viaje)
  matchPrefixes?: string[];
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

// Para agregar un módulo nuevo (Gastos, Viajeros, Documentos...), sumá una línea acá.
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: "/", label: "Inicio", icon: House },
      {
        href: "/viajes",
        label: "Mis viajes",
        icon: Map,
        matchPrefixes: ["/viaje/"],
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      { href: "/viajeros", label: "Viajeros", icon: Users },
      { href: "/categorias", label: "Categorías", icon: Tag },
    ],
  },
];

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(item.href + "/")) return true;
  return (item.matchPrefixes ?? []).some((prefix) => pathname.startsWith(prefix));
}
