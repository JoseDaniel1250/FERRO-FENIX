// ===== EDITA AQUÍ =====
export const EMPRESA = "Ferro-Fénix";
// Número de WhatsApp con código de país, sin "+" ni espacios (ejemplo: 573001234567)
export const WHATSAPP = "573000000000";

export type Producto = { id: string; nombre: string; descripcion: string; imagen: string };

// Las imágenes PNG van en la carpeta public/productos/ (fondo transparente, ~800 px)
export const PRODUCTOS: Producto[] = [
  { id: "p1", nombre: "Producto 1", descripcion: "Descripción corta del producto 1.", imagen: "/productos/producto-1.png" },
  { id: "p2", nombre: "Producto 2", descripcion: "Descripción corta del producto 2.", imagen: "/productos/producto-2.png" },
  { id: "p3", nombre: "Producto 3", descripcion: "Descripción corta del producto 3.", imagen: "/productos/producto-3.png" },
  { id: "p4", nombre: "Producto 4", descripcion: "Descripción corta del producto 4.", imagen: "/productos/producto-4.png" },
  { id: "p5", nombre: "Producto 5", descripcion: "Descripción corta del producto 5.", imagen: "/productos/producto-5.png" },
  { id: "p6", nombre: "Producto 6", descripcion: "Descripción corta del producto 6.", imagen: "/productos/producto-6.png" },
];

export const waLink = (mensaje: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
