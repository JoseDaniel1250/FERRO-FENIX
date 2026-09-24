"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { waLink } from "../data/config";

// ===== Shader del fuego (WebGL) =====
const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T,I,F;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int k=0;k<4;k++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec4 fire(float xn,float xc,float y,float sc,float sp,float hg,float off){
 vec2 q=vec2(xn*sc+off,y*sc*.7-T*sp);
 float w=fbm(q*.8+vec2(0.,T*.15));
 float f=fbm(q+vec2((w-.5)*1.3,w*.6));
 float env=hg*(.5+.5*exp(-xc*xc*1.6));
 float v=clamp(f*1.4+(1.-y/max(env,.001))-.55,0.,1.);
 vec3 c=mix(vec3(.3,.03,.01),vec3(.85,.09,.03),smoothstep(0.,.3,v));
 c=mix(c,vec3(1.,.42,.06),smoothstep(.28,.55,v));
 c=mix(c,vec3(1.,.78,.25),smoothstep(.52,.8,v));
 c=mix(c,vec3(1.,.96,.72),smoothstep(.86,1.,v));
 return vec4(c,smoothstep(.02,.2,v));}
void main(){vec2 uv=gl_FragCoord.xy/R;float y=uv.y,xc=(uv.x-.5)*2.,xn=xc*R.x/R.y*.6;
 if(F>.5){vec4 a=fire(xn,xc,y,3.,1.5,I*.3,7.);a.a*=.85;gl_FragColor=vec4(a.rgb*a.a,a.a);return;}
 vec3 col=mix(vec3(.24,.05,.015),vec3(.02,.004,.003),smoothstep(0.,.95,y));
 col+=I*exp(-y*2.6)*vec3(.55,.15,.03);
 vec4 b=fire(xn*.8,xc,y,2.2,.8,I*.85,3.);b.rgb*=.55;col=mix(col,b.rgb,b.a*.9);
 vec4 a=fire(xn,xc,y,3.2,1.6,I*.62,0.);col=mix(col,a.rgb,a.a);
 gl_FragColor=vec4(col,1.);}`;

type DrawFn = (t: number, i: number) => void;
type Particle = { x: number; y: number; vx?: number; vy: number; r: number; l: number; L: number; s: number };

const base: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" };
const btn: CSSProperties = { padding: "14px 26px", borderRadius: 999, fontWeight: 700, letterSpacing: ".04em", textDecoration: "none", color: "#1a0a02", background: "linear-gradient(90deg,#ffb020,#ff7a1a)", boxShadow: "0 6px 28px rgba(255,110,20,.45)", fontFamily: "system-ui,sans-serif", fontSize: 16 };

export default function FireHero() {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLElement>(null);
  const [cta, setCta] = useState(false);
  useEffect(() => { const id = setTimeout(() => setCta(true), 10500); return () => clearTimeout(id); }, []);

  useEffect(() => {
    const bgc = bgRef.current, cv = cvRef.current, fgc = fgRef.current, wrap = wrapRef.current;
    if (!bgc || !cv || !fgc || !wrap) return;
    const cx = cv.getContext("2d");
    const oc = document.createElement("canvas");
    const ox = oc.getContext("2d");
    if (!cx || !ox) return;

    const sm = (a: number, b: number, x: number) => {
      x = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return x * x * (3 - 2 * x);
    };

    // Sprites de brasas / respaldo 2D
    const stops = [[255, 245, 190], [255, 190, 60], [255, 120, 15], [220, 50, 5], [120, 15, 2], [35, 6, 3]];
    const sprites = stops.map((c) => {
      const s = document.createElement("canvas");
      s.width = s.height = 64;
      const g = s.getContext("2d")!;
      const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      r.addColorStop(0, `rgba(${c},1)`);
      r.addColorStop(0.4, `rgba(${c},.45)`);
      r.addColorStop(1, `rgba(${c},0)`);
      g.fillStyle = r;
      g.fillRect(0, 0, 64, 64);
      return s;
    });

    const mkFire = (c: HTMLCanvasElement, fg: boolean): DrawFn | null => {
      const o = { premultipliedAlpha: true, alpha: true };
      const g = (c.getContext("webgl", o) || c.getContext("experimental-webgl", o)) as WebGLRenderingContext | null;
      if (!g) return null;
      const sh = (type: number, src: string) => {
        const s = g.createShader(type)!;
        g.shaderSource(s, src);
        g.compileShader(s);
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(s));
        return s;
      };
      const p = g.createProgram()!;
      g.attachShader(p, sh(g.VERTEX_SHADER, VS));
      g.attachShader(p, sh(g.FRAGMENT_SHADER, FS));
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) {
        console.warn(g.getProgramInfoLog(p));
        return null;
      }
      g.useProgram(p);
      g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
      const l = g.getAttribLocation(p, "a");
      g.enableVertexAttribArray(l);
      g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0);
      const uR = g.getUniformLocation(p, "R"), uT = g.getUniformLocation(p, "T");
      const uI = g.getUniformLocation(p, "I"), uF = g.getUniformLocation(p, "F");
      return (t, i) => {
        g.viewport(0, 0, c.width, c.height);
        g.uniform2f(uR, c.width, c.height);
        g.uniform1f(uT, t);
        g.uniform1f(uI, i);
        g.uniform1f(uF, fg ? 1 : 0);
        g.clearColor(0, 0, 0, 0);
        g.clear(g.COLOR_BUFFER_BIT);
        g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
      };
    };
    const bgDraw = mkFire(bgc, false), fgDraw = mkFire(fgc, true);
    const gl = bgDraw && fgDraw ? { bg: bgDraw, fg: fgDraw } : null;
    if (!gl) console.warn("WebGL no disponible: se usa el fuego 2D de respaldo");

    let W = 0, H = 0, D = 1, S = 0, t0 = performance.now(), raf = 0;
    const fire: Particle[] = [], sparks: Particle[] = [];

    const resize = () => {
      D = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      W = cv.width = Math.round(r.width * D);
      H = cv.height = Math.round(r.height * D);
      for (const c of [bgc, fgc]) { c.width = (W * 0.6) | 0; c.height = (H * 0.6) | 0; }
      S = Math.min(W * 0.92, H * 0.7);
      oc.width = oc.height = Math.round(S);
    };
    const restart = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      t0 = performance.now(); fire.length = 0; sparks.length = 0;
    };
    let visible = true; // pausa el dibujo cuando el hero no se ve
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(wrap);
    resize();
    window.addEventListener("resize", resize);
    wrap.addEventListener("pointerdown", restart);

    const emit = (n: number, k: number) => {
      for (let i = 0; i < n; i++) {
        const u = (Math.random() + Math.random() + Math.random()) / 3;
        fire.push({
          x: W * (0.5 + (u - 0.5) * 1.35), y: H * (1.02 + Math.random() * 0.04),
          vx: (Math.random() - 0.5) * 30 * D, vy: -(70 + Math.random() * 170) * D * (0.6 + k * 0.7),
          r: (55 + Math.random() * 90) * D * (0.5 + k * 0.6), l: 0, L: 1.6 + Math.random() * 1.8, s: Math.random() * 9,
        });
      }
      if (Math.random() < k * 0.9) sparks.push({
        x: W * (0.15 + Math.random() * 0.7), y: H * (0.75 + Math.random() * 0.3),
        vy: -(50 + Math.random() * 130) * D, r: (1 + Math.random() * 2.2) * D, l: 0, L: 3 + Math.random() * 4, s: Math.random() * 9,
      });
    };

    const ph = new Image();
    const frame = (now: number) => {
      if (!visible) { raf = requestAnimationFrame(frame); return; }
      const t = (now - t0) / 1000, dt = 1 / 60;
      const inten = 0.1 + 0.9 * sm(1, 6, t);   // el fuego crece
      const rev = sm(4.5, 10, t);              // el logo emerge
      const heat = 1 - sm(6.5, 11.5, t);       // incandescente -> color real
      cx.globalCompositeOperation = "source-over";
      cx.clearRect(0, 0, W, H);
      if (gl) gl.bg(t, inten);
      else {
        const bg = cx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#050101"); bg.addColorStop(0.6, "#180603"); bg.addColorStop(1, "#3a0d04");
        cx.fillStyle = bg; cx.fillRect(0, 0, W, H);
      }
      emit(gl ? 0 : Math.round(2 + inten * 4), inten);
      const pass = (fg: boolean) => {
        cx.globalCompositeOperation = "lighter";
        for (const p of fire) {
          if ((p.y > H * 0.78) !== fg) continue;
          const u = p.l / p.L; if (u >= 1) continue;
          cx.globalAlpha = Math.min(1, (1 - u) * (fg ? 0.06 : 0.1) * (0.35 + inten));
          const sz = p.r * (1 + u * 0.6) * 2, i = Math.min(5, 1 + Math.floor(u * 5));
          cx.drawImage(sprites[i], p.x - sz / 2, p.y - sz / 2, sz, sz);
        }
        cx.globalAlpha = 1;
      };
      if (!gl) pass(false);

      // Logo
      const cxp = W / 2, by = H * 0.47 + (1 - rev) * S * 0.22;
      const br = 1 + 0.012 * Math.sin(t * 1.7) + 0.05 * Math.exp(-Math.pow(t - 10, 2) / 1.2) * rev;
      cx.globalCompositeOperation = "lighter";
      const halo = cx.createRadialGradient(cxp, by, 0, cxp, by, S * 0.75);
      const ha = (0.18 + 0.1 * Math.sin(t * 2.3)) * (0.3 + rev) + heat * 0.25 * rev;
      halo.addColorStop(0, `rgba(255,150,40,${ha})`); halo.addColorStop(1, "rgba(255,60,0,0)");
      cx.fillStyle = halo; cx.fillRect(0, 0, W, H);
      if (rev > 0 && ph.complete) {
        ox.globalCompositeOperation = "source-over"; ox.clearRect(0, 0, S, S); ox.drawImage(ph, 0, 0, S, S);
        ox.globalCompositeOperation = "source-atop"; ox.fillStyle = `rgba(255,225,150,${heat * 0.85})`; ox.fillRect(0, 0, S, S);
        const e = S * (1.25 - 1.5 * rev), m = ox.createLinearGradient(0, e, 0, e + S * 0.3);
        m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(1, "rgba(0,0,0,1)");
        ox.globalCompositeOperation = "destination-in"; ox.fillStyle = m; ox.fillRect(0, 0, S, S);
        cx.globalCompositeOperation = "source-over"; cx.save();
        cx.translate(cxp, by + S * 0.3); cx.scale(1 + (br - 1) * 0.5, br); cx.translate(-S / 2, -S * 0.8);
        cx.drawImage(oc, 0, 0); cx.restore();
      }
      if (gl) gl.fg(t, inten); else pass(true);

      // Brasas
      cx.globalCompositeOperation = "lighter";
      for (const p of sparks) {
        const u = p.l / p.L; if (u >= 1) continue;
        cx.globalAlpha = (1 - u) * (0.6 + 0.4 * Math.sin(t * 9 + p.s));
        const sz = p.r * 7; cx.drawImage(sprites[1], p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
      cx.globalAlpha = 1;
      for (const a of [fire, sparks]) {
        for (let i = a.length - 1; i >= 0; i--) {
          const p = a[i]; p.l += dt;
          if (p.l >= p.L) { a.splice(i, 1); continue; }
          p.y += p.vy * dt;
          p.x += (p.vx || 0) * dt + Math.sin(t * 3 + p.s + p.y * 0.01) * 18 * D * dt;
        }
      }
      raf = requestAnimationFrame(frame);
    };
    ph.onload = () => { raf = requestAnimationFrame(frame); };
    ph.src = "/logo.webp";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointerdown", restart);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={wrapRef} style={{ position: "relative", width: "100%", height: "100svh", overflow: "hidden", background: "#070201" }}>
      <canvas ref={bgRef} style={{ ...base, zIndex: 0 }} />
      <canvas ref={cvRef} style={{ ...base, zIndex: 1 }} />
      <canvas ref={fgRef} style={{ ...base, zIndex: 2 }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "5vh", zIndex: 3, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "0 16px", opacity: cta ? 1 : 0, transform: cta ? "none" : "translateY(12px)", transition: "all .9s ease", pointerEvents: cta ? "auto" : "none" }}>
        <a href="#catalogo" style={btn}>Ver catálogo</a>
        <a href={waLink("Hola, quiero más información.")} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#25D366", color: "#06210f", boxShadow: "0 6px 24px rgba(37,211,102,.35)" }}>Escribir por WhatsApp</a>
      </div>
    </section>
  );
}
