/* ============================================================
   MUEQUETÁ — DATOS EDITABLES
   Todo lo que está vacío o en `false` es información PENDIENTE de
   confirmar con el cliente. Mientras `revision` sea true, la web muestra
   marcas "Por confirmar" y el panel de pendientes. Para publicar:
   1) completar los datos, 2) poner en true lo ya confirmado,
   3) poner revision: false.
   ============================================================ */
window.MUEQUETA = {
  revision: false,

  // Contacto confirmado por el cliente.
  // WhatsApp en formato internacional sin "+" ni espacios, ej. "573001234567"
  whatsapp: "573125239940",
  telefono: "+57 312 523 9940",
  correo: "muequetamv@gmail.com",
  instagram: "https://www.instagram.com/muequeta/",
  facebook: "https://www.facebook.com/share/1C4kp8ehuG/?mibextid=wwXIfr",
  mensajeWhatsapp: "Hola, quisiera solicitar atención veterinaria para un animal.",

  // Qué está confirmado (true) y puede mostrarse sin marca de revisión
  confirmado: {
    urgencias247: true,        // Urgencias 24 horas, según disponibilidad (confirmado)
    hospitalizacion: false,    // "Hospitalización en la Sabana de Bogotá"
    camelidos: true,           // llamas y alpacas (se mantiene como está)
    zonas: true,               // zonas de atención (confirmado)
    cargoManuel: false,        // "Fundador y director"
    proceso: true,            // solicitud directa por WhatsApp con mensaje listo
    asignacionFotos: false     // qué foto corresponde a cada integrante
  },

  cargoManuel: "Fundador y director",
  zonas: ["Magdalena Medio", "Bogotá y Sabana de Bogotá", "Llanos Orientales"]
};
