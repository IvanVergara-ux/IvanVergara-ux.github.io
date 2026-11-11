// Valida las URL que vienen de los datos antes de ponerlas en href o src.
// Solo permite rutas del propio sitio, anclas y protocolos seguros; cualquier otra cosa
// (por ejemplo "javascript:" o "data:") se reemplaza por un valor inofensivo.

const SAFE_PROTOCOLS = new Set(['https:', 'mailto:']);

export function safeUrl(value, fallback = '#') {
  if (typeof value !== 'string') return fallback;
  const url = value.trim();
  if (!url) return fallback;

  // Rutas relativas del propio sitio ("assets/logo.png") y anclas ("#contacto").
  // "//dominio" apunta a otro sitio, así que no cuenta como relativa.
  const isRelative = !url.startsWith('//') && !/^[a-z][a-z0-9+.-]*:/i.test(url) && /^[\w\-./#%?=&]+$/.test(url);
  if (isRelative) return url;

  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

/** Atributos para enlaces que abren otra pestaña sin dar acceso a esta página. */
export const EXTERNAL_LINK = 'target="_blank" rel="noopener noreferrer"';
