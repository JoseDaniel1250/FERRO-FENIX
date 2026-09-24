import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ferro-Fénix",
  description: "Sitio oficial de Ferro-Fénix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#070201", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
