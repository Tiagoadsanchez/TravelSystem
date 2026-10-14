"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthProvider";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/viajes", label: "Viajes" },
  { href: "/categorias", label: "Categorías" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">✈️ Mis Viajes</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              "sidebar-link" + (pathname === item.href ? " active" : "")
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-email">{user.email}</div>
        <button className="btn-small" onClick={signOut}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
