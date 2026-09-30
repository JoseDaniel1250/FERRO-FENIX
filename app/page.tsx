import FireHero from "./components/FireHero";
import Catalogo from "./components/Catalogo";
import { EMPRESA, WHATSAPP, waLink } from "./data/config";

// ===== EDITA AQUÍ =====
const DIRECCION = "Carrera 8 # 14 - 36, Zarzal, Valle";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(DIRECCION);

const card = {
  maxWidth: 480,
  margin: "0 auto",
  padding: "38px 32px 34px",
  borderRadius: 24,
  background: "rgba(14,6,3,.72)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  border: "1px solid rgba(255,150,50,.45)",
  boxShadow: "0 0 34px rgba(255,90,0,.22)",
} as const;

const cardTitle = {
  margin: 0,
  fontFamily: "Georgia,serif",
  fontWeight: 400,
  fontSize: "clamp(26px,4.5vw,36px)",
  letterSpacing: ".14em",
} as const;

const cardText = { color: "#e7cbac", fontSize: 16, margin: "10px 0 0", lineHeight: 1.5 } as const;

const btn = {
  display: "inline-block",
  padding: "15px 26px",
  borderRadius: 999,
  fontWeight: 700,
  textDecoration: "none",
  fontSize: 15,
} as const;

export default function Home() {
  return (
    <main style={{ background: "#070201", color: "#ffe9c4", fontFamily: "system-ui,sans-serif" }}>
      <h1 className="sr-only">{EMPRESA}</h1>
      <FireHero />

      {/* Fondo de la ferretería: corre detrás del catálogo, contacto y ubicación, sin cortes entre secciones */}
      <div
        style={{
          position: "relative",
          backgroundImage:
            "linear-gradient(180deg, rgba(7,2,1,0) 0%, rgba(7,2,1,.5) 18%, rgba(7,2,1,.82) 60%, rgba(7,2,1,.97) 100%), url('/fondo-ferreteria.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundAttachment: "fixed",
        }}
      >
        <Catalogo />

        <section style={{ padding: "40px 16px 22px", textAlign: "center" }}>
          <div style={card}>
            <h2 style={cardTitle}>CONTACTO</h2>
            <p style={cardText}>Escríbenos y te respondemos por WhatsApp.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <a href={waLink("Hola, quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#25D366", color: "#06210f" }}>
                Escribir por WhatsApp
              </a>
              <a href={`tel:+${WHATSAPP}`} style={{ ...btn, border: "1px solid rgba(255,140,40,.6)", color: "#ffb020" }}>
                Llamar
              </a>
            </div>
          </div>
        </section>

        <section style={{ padding: "22px 16px 70px", textAlign: "center" }}>
          <div style={card}>
            <h2 style={cardTitle}>UBICACIÓN</h2>
            <p style={cardText}>{DIRECCION}</p>
            <div style={{ marginTop: 20 }}>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ ...btn, border: "1px solid rgba(255,140,40,.6)", color: "#ffb020" }}>
                Cómo llegar
              </a>
            </div>
          </div>
        </section>

        <p style={{ textAlign: "center", color: "#c9a88a", fontSize: 12, opacity: 0.75, padding: "0 0 40px" }}>
          © {new Date().getFullYear()} {EMPRESA}
        </p>
      </div>
    </main>
  );
}
