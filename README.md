# Muequetá — sitio web

Sitio estático. Cada página (`index.html`, `servicios.html`, `equipo.html`, `contacto.html`) lleva sus estilos, su código y sus imágenes incrustados: no hay carpetas.

## Archivos para subir
- `index.html`, `servicios.html`, `equipo.html`, `contacto.html`
- `site-config.js` (contacto y zonas: lo único que se edita)
- `og.jpg` (imagen que se ve al compartir el enlace)

## Antes de publicar
1. Reemplazar `https://TU-DOMINIO.com` por el dominio real en las 4 páginas (etiquetas `og:url`, `og:image` y `twitter:image`).
2. Para que Google indexe el sitio, borrar la línea `<meta name="robots" content="noindex,nofollow">` de las 4 páginas.
