import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/AuthProvider";
import AuthGate from "@/components/AuthGate";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Planificador de Viajes",
  description: "App para planear cronogramas de viaje día a día",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content">
              <AuthGate>{children}</AuthGate>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
