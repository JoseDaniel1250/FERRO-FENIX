"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { PRODUCTOS, waLink } from "../data/config";

function Img({ src, alt }: { src: string; alt: string }) {
  const [fail, setFail] = useState(false);
  if (fail) {
    return <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "#ff9a4a", opacity: 0.6, fontSize: 14 }}>Imagen pendiente</div>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} draggable={false} onError={() => setFail(true)}
      style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 14px 26px rgba(255,90,0,.35))" }} />
  );
}

const arrow: CSSProperties = { width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,140,40,.5)", background: "rgba(255,110,20,.12)", color: "#ffb020", fontSize: 24, cursor: "pointer" };

export default function Catalogo() {
  const n = PRODUCTOS.length, step = 360 / n;
  const [idx, setIdx] = useState(0); // pasos acumulados: la ruleta siempre gira en continuo
  const [paused, setPaused] = useState(false);
  const [cw, setCw] = useState(240);
  const startX = useRef<number | null>(null);
  const active = ((idx % n) + n) % n;
  const ch = Math.round(cw * 1.25);
  const R = Math.round(cw / 2 / Math.tan(Math.PI / n)) + 24;

  useEffect(() => {
    const f = () => setCw(Math.min(260, Math.round(window.innerWidth * 0.6)));
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => i + 1), 4500);
    return () => clearInterval(id);
  }, [paused]);

  const go = (i: number) => { let d = (i - active + n) % n; if (d > n / 2) d -= n; setIdx((x) => x + d); };
  const p = PRODUCTOS[active];

  return (
    <section id="catalogo" style={{ padding: "90px 16px 70px", textAlign: "center", background: "linear-gradient(#070201,#120604 60%,#070201)", overflow: "hidden", fontFamily: "system-ui,sans-serif" }}>
      <h2 style={{ margin: 0, fontFamily: "Georgia,serif", fontWeight: 400, fontSize: "clamp(28px,5vw,46px)", letterSpacing: ".12em", color: "#ffe9c4" }}>CATÁLOGO</h2>
      <p style={{ margin: "10px 0 0", color: "#c9a88a" }}>Desliza o usa las flechas para ver los productos</p>

      <div
        style={{ perspective: 1100, height: ch + 40, marginTop: 32, touchAction: "pan-y", userSelect: "none" }}
        onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => { startX.current = e.clientX; setPaused(true); }}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current; startX.current = null;
          if (dx > 40) setIdx((i) => i - 1); else if (dx < -40) setIdx((i) => i + 1);
          setTimeout(() => setPaused(false), 6000);
        }}
      >
        <div style={{ position: "relative", width: cw, height: ch, margin: "20px auto 0", transformStyle: "preserve-3d", transform: `translateZ(${-R}px) rotateY(${-idx * step}deg)`, transition: "transform .9s cubic-bezier(.2,.7,.2,1)" }}>
          {PRODUCTOS.map((pr, i) => (
            <div key={pr.id} style={{ position: "absolute", inset: 0, transform: `rotateY(${i * step}deg) translateZ(${R}px)`, backfaceVisibility: "hidden", opacity: i === active ? 1 : 0.5, transition: "opacity .6s", borderRadius: 20, padding: 16, boxSizing: "border-box", display: "flex", flexDirection: "column", background: "linear-gradient(160deg,#1f0b05,#0b0403)", border: "1px solid rgba(255,140,40,.35)", boxShadow: i === active ? "0 0 40px rgba(255,100,20,.35)" : "none" }}>
              <div style={{ flex: 1, minHeight: 0 }}><Img src={pr.imagen} alt={pr.nombre} /></div>
              <div style={{ marginTop: 10, fontWeight: 700, color: "#ffe9c4" }}>{pr.nombre}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginTop: 24 }}>
        <button aria-label="Anterior" style={arrow} onClick={() => setIdx((i) => i - 1)}>‹</button>
        {PRODUCTOS.map((pr, i) => (
          <button key={pr.id} aria-label={pr.nombre} onClick={() => go(i)} style={{ width: 10, height: 10, borderRadius: "50%", border: 0, cursor: "pointer", background: i === active ? "#ff9a2a" : "rgba(255,255,255,.25)" }} />
        ))}
        <button aria-label="Siguiente" style={arrow} onClick={() => setIdx((i) => i + 1)}>›</button>
      </div>

      <div style={{ maxWidth: 520, margin: "28px auto 0" }}>
        <h3 style={{ margin: 0, fontSize: 24, color: "#ffe9c4" }}>{p.nombre}</h3>
        <p style={{ color: "#c9a88a", lineHeight: 1.5 }}>{p.descripcion}</p>
        <a href={waLink(`Hola, me interesa: ${p.nombre}. ¿Me pueden dar más información?`)} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", padding: "13px 26px", borderRadius: 999, fontWeight: 700, textDecoration: "none", background: "#25D366", color: "#06210f" }}>
          Cotizar por WhatsApp
        </a>
      </div>
    </section>
  );
}
