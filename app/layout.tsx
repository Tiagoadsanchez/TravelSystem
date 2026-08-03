import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthProvider";
import AuthGate from "@/components/AuthGate";
import AuthHeader from "@/components/AuthHeader";

export const metadata: Metadata = {
  title: "Planificador de Viajes",
  description: "App para planear cronogramas de viaje día a día",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <header className="app-header">
            <div className="header-nav">
              <a href="/" className="logo">✈️ Mis Viajes</a>
              <a href="/categorias" className="nav-link">Categorías</a>
            </div>
            <AuthHeader />
          </header>
          <main className="container">
            <AuthGate>{children}</AuthGate>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
