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

      <a href={waLink("Hola, quiero más información.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        style={{ position: "fixed", right: 18, bottom: "calc(18px + env(safe-area-inset-bottom, 0px))", zIndex: 50, width: 58, height: 58, borderRadius: "50%", background: "#25D366", display: "grid", placeItems: "center", boxShadow: "0 6px 24px rgba(0,0,0,.5)" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#06210f" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.6 12.3c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-2.7-1-4.4-3.7-4.6-3.9-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/></svg>
      </a>
    </main>
  );
}
