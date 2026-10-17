import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"; // ← nueva

export const metadata: Metadata = {
  title: "Ferro-Fénix",
  description: "Sitio oficial de Ferro-Fénix.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ scrollBehavior: "smooth" }}>
      <body style={{ margin: 0, background: "#070201" }}>
        {children}
        <Analytics /> {/* ← nueva */}
      </body>
    </html>
  );
}
