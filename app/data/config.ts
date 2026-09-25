// ===== EDITA AQUÍ =====
export const EMPRESA = "Ferro-Fénix";
// Número de WhatsApp con código de país, sin "+" ni espacios (ejemplo: 573001234567)
export const WHATSAPP = "573000000000";

export type Producto = { id: string; nombre: string; descripcion: string; imagen: string };

// Las imágenes PNG van en la carpeta public/productos/ (fondo transparente, ~800 px)
export const PRODUCTOS: Producto[] = [
  { id: "p1", nombre: "Cemento San Marcos", descripcion: "Cemento Uso General.", imagen: "/productos/producto-1.png" },
  { id: "p2", nombre: "Cemento Cemex", descripcion: "Cemento Uso General.", imagen: "/productos/producto-2.png" },
  { id: "p3", nombre: "Herramientas", descripcion: "Gran Variedad.", imagen: "/productos/producto-3.png" },
  { id: "p4", nombre: "Ladrillos", descripcion: "Farol, Tolete.", imagen: "/productos/producto-4.png" },
  { id: "p5", nombre: "Supermastick", descripcion: "Estuco Para Interiores.", imagen: "/productos/producto-5.png" },
  { id: "p6", nombre: "Hierro", descripcion: "Todos Los Calibres", imagen: "/productos/producto-6.png" },
];

export const waLink = (mensaje: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
