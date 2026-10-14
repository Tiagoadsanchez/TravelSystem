"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Compass, Menu } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import AuthGate from "@/components/AuthGate";
import Sidebar from "@/components/Sidebar";

const COLLAPSED_KEY = "sidebar-collapsed";

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      // sin localStorage: queda expandido
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function alternarColapsado() {
    const siguiente = !collapsed;
    setCollapsed(siguiente);
    try {
      localStorage.setItem(COLLAPSED_KEY, siguiente ? "1" : "0");
    } catch {
      // no pasa nada si no se puede recordar
    }
  }

  // Sin sesión (login) no hay menú: solo el contenido centrado.
  if (!user) {
    return (
      <main className="auth-main">
        <AuthGate>{children}</AuthGate>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <Compass className="brand-icon" size={22} aria-hidden="true" />
        <span>Rumbo</span>
      </div>

      <div
        className={"sidebar-overlay" + (mobileOpen ? " open" : "")}
        onClick={() => setMobileOpen(false)}
      />

      <Sidebar
        pathname={pathname}
        email={user.email ?? ""}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={alternarColapsado}
        onNavigate={() => setMobileOpen(false)}
        onSignOut={signOut}
      />

      <main className="main-content">
        <div className="page">
          <AuthGate>{children}</AuthGate>
        </div>
      </main>
    </div>
  );
}
