import { raw } from '../utils/html.js';

// Emblemas propios a dos tonos (no son íconos de librería).
// Usan dos variables CSS: --e-main (tono fuerte) y --e-soft (tono suave),
// definidas por la clase de tono: .emblem--mint, --amber, --sky, --ink, --night.

const M = 'var(--e-main)';
const S = 'var(--e-soft)';

const shapes = Object.freeze({
  // Servicios
  window: `<rect x="3" y="5" width="26" height="22" rx="5" fill="${S}"/><path d="M3 10a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v1H3z" fill="${M}"/><rect x="7" y="15" width="11" height="3" rx="1.5" fill="${M}"/><rect x="7" y="20" width="7" height="3" rx="1.5" fill="${M}" opacity=".55"/><circle cx="23" cy="20" r="3.5" fill="${M}"/>`,
  bag: `<path d="M6 11h20l-1.6 14.2A3 3 0 0 1 21.4 28H10.6a3 3 0 0 1-3-2.8z" fill="${S}"/><path d="M11 13V9a5 5 0 0 1 10 0v4" fill="none" stroke="${M}" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="20" r="3.4" fill="${M}"/>`,
  phone: `<rect x="8" y="3" width="16" height="26" rx="4.5" fill="${S}"/><rect x="13" y="6" width="6" height="2" rx="1" fill="${M}"/><path d="M15 14h11a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-5l-4 3v-3h-2a3 3 0 0 1-3-3v-4a3 3 0 0 1 3-3z" fill="${M}"/>`,
  stack: `<ellipse cx="16" cy="23" rx="11" ry="4.5" fill="${S}"/><ellipse cx="16" cy="16" rx="11" ry="4.5" fill="${M}" opacity=".6"/><ellipse cx="16" cy="9" rx="11" ry="4.5" fill="${M}"/>`,

  // Proyectos
  route: `<rect x="3" y="3" width="26" height="26" rx="7" fill="${S}"/><path d="M9 24c0-6 5-6 7-9s1-6 5-6" fill="none" stroke="${M}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 4.4"/><circle cx="9" cy="24" r="2.6" fill="${M}"/><path d="M22 4.5a4.5 4.5 0 0 1 4.5 4.5c0 3.4-4.5 7-4.5 7s-4.5-3.6-4.5-7A4.5 4.5 0 0 1 22 4.5z" fill="${M}"/><circle cx="22" cy="9" r="1.6" fill="${S}"/>`,
  scissors: `<path d="M12 12 27 25M12 20 27 7" stroke="${S}" stroke-width="3.2" stroke-linecap="round"/><circle cx="8" cy="9" r="4.2" fill="none" stroke="${M}" stroke-width="2.6"/><circle cx="8" cy="23" r="4.2" fill="none" stroke="${M}" stroke-width="2.6"/><circle cx="16" cy="16" r="1.8" fill="${M}"/>`,
  box: `<path d="M16 3 28 9.5 16 16 4 9.5z" fill="${S}"/><path d="M4 9.5 16 16v13L4 22.5z" fill="${M}"/><path d="M28 9.5 16 16v13l12-6.5z" fill="${M}" opacity=".65"/>`,

  // Compromisos
  tag: `<path d="M4 6a2 2 0 0 1 2-2h9.2a2 2 0 0 1 1.4.6l11 11a2 2 0 0 1 0 2.8l-9.2 9.2a2 2 0 0 1-2.8 0l-11-11A2 2 0 0 1 4 15.2z" fill="${S}"/><circle cx="10" cy="10" r="2.6" fill="${M}"/><path d="M14 20l6-6" stroke="${M}" stroke-width="2.6" stroke-linecap="round"/>`,
  eye: `<path d="M2 16S7 6 16 6s14 10 14 10-5 10-14 10S2 16 2 16z" fill="${S}"/><circle cx="16" cy="16" r="6" fill="${M}"/><circle cx="18" cy="14" r="1.8" fill="${S}"/>`,
  layers: `<path d="M16 17 3 10.5 16 4l13 6.5z" fill="${M}"/><path d="M5.5 15.5 16 21l10.5-5.5L29 17l-13 6.5L3 17z" fill="${M}" opacity=".6"/><path d="M5.5 22 16 27.5 26.5 22 29 23.5 16 30 3 23.5z" fill="${S}"/>`,
  translate: `<path d="M3 7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-5 4v-4H6a3 3 0 0 1-3-3z" fill="${S}"/><path d="M29 15a3 3 0 0 0-3-3H15a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h6l5 4v-4a3 3 0 0 0 3-3z" fill="${M}"/><path d="M17 22l3-7 3 7M18 20h4" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,

  // Proceso
  chat: `<path d="M3 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-7l-5 4v-4a4 4 0 0 1-4-4z" fill="${M}"/><path d="M26 12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3v4l-5-4h-5a3 3 0 0 1-3-3v-1h6a5 5 0 0 0 5-5v-3z" fill="${S}"/>`,
  document: `<path d="M7 3h12l7 7v17a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="${S}"/><path d="M19 3v5a2 2 0 0 0 2 2h5z" fill="${M}" opacity=".6"/><path d="M10 20l3.5 3.5L22 15" fill="none" stroke="${M}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  code: `<rect x="3" y="5" width="26" height="22" rx="5" fill="${S}"/><path d="M12 12l-4 4 4 4M20 12l4 4-4 4" fill="none" stroke="${M}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 10.5l-3 11" stroke="${M}" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`,
  rocket: `<path d="M16 3c5 3 7.5 8 7.5 13.5L20 21h-8l-3.5-4.5C8.5 11 11 6 16 3z" fill="${M}"/><circle cx="16" cy="12" r="2.8" fill="${S}"/><path d="M12 21h8l-1.5 5-2.5 3-2.5-3z" fill="${S}"/><path d="M8.5 16.5 4 20l1 4 6-3zM23.5 16.5 28 20l-1 4-6-3z" fill="${M}" opacity=".6"/>`,
});

export function emblem(name, { tone = 'mint', size = 32 } = {}) {
  const body = shapes[name] ?? shapes.window;
  return raw(
    `<span class="emblem emblem--${tone}" aria-hidden="true"><svg width="${size}" height="${size}" viewBox="0 0 32 32" focusable="false">${body}</svg></span>`,
  );
}
