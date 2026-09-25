import FireHero from "./components/FireHero";
import Catalogo from "./components/Catalogo";
import { EMPRESA, WHATSAPP, waLink } from "./data/config";

const boton = { display: "inline-block", padding: "14px 28px", borderRadius: 999, fontWeight: 700, textDecoration: "none" } as const;

export default function Home() {
  return (
    <main style={{ background: "#070201", color: "#ffe9c4", fontFamily: "system-ui,sans-serif" }}>
      <h1 className="sr-only">{EMPRESA}</h1>
      <FireHero />
      <Catalogo />

      <section id="contacto" style={{ padding: "70px 16px 90px", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontFamily: "Georgia,serif", fontWeight: 400, fontSize: "clamp(28px,5vw,46px)", letterSpacing: ".12em" }}>CONTACTO</h2>
        <p style={{ color: "#c9a88a" }}>Escríbenos y te respondemos por WhatsApp.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <a href={waLink("Hola, quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer" style={{ ...boton, background: "#25D366", color: "#06210f" }}>Escribir por WhatsApp</a>
          <a href={`tel:+${WHATSAPP}`} style={{ ...boton, border: "1px solid rgba(255,140,40,.6)", color: "#ffb020" }}>Llamar</a>
        </div>
        <p style={{ marginTop: 60, fontSize: 13, color: "#7d6350" }}>© {new Date().getFullYear()} {EMPRESA}</p>
      </section>
    </main>
  );
}
