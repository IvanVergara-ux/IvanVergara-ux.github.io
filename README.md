# Portafolio de Iván Vergara Mercado

Sitio estático en HTML, CSS y JavaScript con módulos, sin librerías ni compilación. Funciona en español e inglés.

## Estructura

```
index.html                 Esqueleto de la página: cada sección es una región vacía que llena un componente
assets/                    Favicon e imágenes (foto y capturas en assets/img/)
css/
  tokens.css               Colores, tipografía y espacios (cambia aquí la identidad visual)
  base.css, layout.css     Reset, elementos y contenedores
  components/*.css         Un archivo por componente
js/
  main.js                  Punto de composición: crea las dependencias y las inyecta
  config/site.config.js    Nombre, foto, WhatsApp, correo y GitHub
  config/navigation.js     Enlaces del menú y del pie de página
  data/*.js                Proyectos, servicios, compromisos, pasos, preguntas frecuentes, portada y opciones del mensaje
  i18n/                    Servicio de idioma, preferencia guardada y textos (locales/es.js, locales/en.js)
  services/                WhatsApp, metadatos, palabras que rotan, contadores animados, cifras y preferencia de movimiento
  ui/Component.js          Clase base: contrato común de todos los componentes
  ui/components/*.js       Un componente por sección
  utils/html.js            Plantillas con escape automático (evita inyección de HTML)
```

## Cómo se aplica SOLID

- **Responsabilidad única:** cada clase hace una sola cosa. `I18n` traduce, `LocalePreference` guarda el idioma, `WhatsAppLinkBuilder` arma enlaces, `DocumentMeta` actualiza el título, `WordRotator` rota las palabras, `CountUp` anima las cifras, y cada componente pinta solo su sección.
- **Abierto/cerrado:** para agregar un proyecto, servicio, pregunta, paso u opción del mensaje se edita `js/data/`, no los componentes. Para agregar un idioma se crea `locales/xx.js` y se registra en `main.js`.
- **Sustitución de Liskov:** todos los componentes heredan de `Component` y `main.js` los trata igual (`render()`), sin saber cuál es cuál.
- **Segregación de interfaces:** cada componente recibe solo lo que usa (por ejemplo, `Services` no conoce el WhatsApp ni los proyectos).
- **Inversión de dependencias:** nadie importa servicios globales. `main.js` crea las dependencias y las pasa por constructor, así se pueden cambiar o simular en pruebas.

## Tareas comunes

| Quiero… | Archivo |
| --- | --- |
| Poner mi foto | Guardarla en `assets/img/` y poner la ruta en `photo` de `js/config/site.config.js` |
| Agregar GitHub | `github` en `js/config/site.config.js` |
| Agregar un proyecto o una captura | `js/data/projects.js` (`image`, `links.repo`, `links.demo`) |
| Cambiar las preguntas frecuentes | `js/data/faq.js` |
| Cambiar las palabras que rotan en la portada | `js/data/hero.js` |
| Cambiar un texto | `js/i18n/locales/es.js` y `en.js` |
| Cambiar colores o fuentes | `css/tokens.css` |
| Cambiar el logo | `assets/logo.png` (512 × 512, fondo transparent), `assets/favicon.png` y `assets/apple-touch-icon.png` |

## Probar en local

Los módulos de JavaScript no cargan abriendo el archivo con doble clic. Usa la extensión **Live Server** de VS Code (clic derecho en `index.html` → Open with Live Server) o:

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## Versión de producción (compilada)

Para publicar, el sitio se compila en `dist/`: todos los módulos se unen en **un solo JavaScript** y todas las hojas en **un solo CSS**, ambos minificados. Carga 2 archivos en lugar de ~33, pesa menos y el código publicado es difícil de leer.

```bash
npm install      # solo la primera vez (requiere Node.js)
npm run build    # genera dist/
```

No hace falta compilar a mano para publicar: GitHub lo hace solo (ver abajo).

## Publicar en GitHub Pages

1. Crea un repositorio (por ejemplo `tu-usuario.github.io`) y sube esta carpeta a la rama `main`.
   `node_modules/` y `dist/` no se suben (están en `.gitignore`).
2. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
3. Cada vez que subas un cambio a `main`, el flujo `.github/workflows/deploy.yml` compila y publica el sitio. El avance se ve en la pestaña **Actions**.

## Seguridad

- **Política de seguridad de contenido (CSP)** en `index.html`: el navegador solo ejecuta scripts de este sitio y solo carga estilos y fuentes de Google Fonts. Bloquea scripts inyectados, plugins y envío de formularios a otros sitios.
- **Escape automático**: todo texto que se inserta en la página pasa por `js/utils/html.js`, que impide inyectar HTML (XSS).
- **URL validadas**: `js/utils/url.js` solo deja pasar rutas del sitio, `https:` y `mailto:`; bloquea `javascript:`, `data:`, `http:` y direcciones a otros dominios disfrazadas.
- **Enlaces externos** con `rel="noopener noreferrer"`: la pestaña que se abre no puede controlar esta página ni ver de dónde viene el visitante.
- **Sin dependencias en el navegador**: no se carga ninguna librería de terceros, así que no hay código ajeno que pueda tener vulnerabilidades.

Sobre F12 / Inspeccionar: ningún sitio web puede ocultar su código, porque el navegador necesita descargarlo para mostrar la página. Bloquear F12 o el clic derecho se evita en segundos y solo empeora la experiencia. Lo que sí se hace aquí es publicar el código **minificado** (difícil de leer) y no incluir nada secreto en el sitio: todo lo que contiene (nombre, correo, WhatsApp) es información pública a propósito.
