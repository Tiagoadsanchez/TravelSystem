import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/lib/AuthProvider";
import { ConfirmProvider } from "@/components/ConfirmProvider";
import AppShell from "@/components/AppShell";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rumbo · Cuaderno de viajes",
  description: "Cuaderno de viajes para planear tu agenda día a día",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={nunito.className}>
        <AuthProvider>
          <ConfirmProvider>
            <AppShell>{children}</AppShell>
          </ConfirmProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
