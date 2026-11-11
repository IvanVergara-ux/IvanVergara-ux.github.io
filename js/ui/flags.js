import { raw } from '../utils/html.js';

// Banderas dibujadas en SVG (los emojis de bandera no se ven en Windows).
// Inglés: Reino Unido y Estados Unidos, divididas en diagonal.
// Cada bandera usa ids propios para sus recortes, así puede repetirse en la página sin conflictos.

let instance = 0;

const spain = `
  <rect width="32" height="32" fill="#AA151B"/>
  <rect y="8" width="32" height="16" fill="#F1BF00"/>`;

const unitedKingdom = `
  <rect width="32" height="32" fill="#012169"/>
  <path d="M0 0 32 32M32 0 0 32" stroke="#FFF" stroke-width="6.4"/>
  <path d="M0 0 32 32M32 0 0 32" stroke="#C8102E" stroke-width="2.6"/>
  <path d="M16 0v32M0 16h32" stroke="#FFF" stroke-width="10"/>
  <path d="M16 0v32M0 16h32" stroke="#C8102E" stroke-width="6"/>`;

const unitedStates = `
  <rect width="32" height="32" fill="#FFF"/>
  ${[0, 2, 4, 6, 8, 10, 12].map((i) => `<rect y="${(i * 32) / 13}" width="32" height="${32 / 13}" fill="#B22234"/>`).join('')}
  <rect width="15" height="17.2" fill="#3C3B6E"/>
  ${[3, 7.5, 12].flatMap((x) => [3.5, 8.5, 13.5].map((y) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#FFF"/>`)).join('')}`;

const FLAGS = Object.freeze({
  es: (id) => `<clipPath id="${id}-round"><circle cx="16" cy="16" r="16"/></clipPath>
    <g clip-path="url(#${id}-round)">${spain}</g>`,
  en: (id) => `<clipPath id="${id}-round"><circle cx="16" cy="16" r="16"/></clipPath>
    <clipPath id="${id}-half"><path d="M32 0V32H0z"/></clipPath>
    <g clip-path="url(#${id}-round)">
      ${unitedKingdom}
      <g clip-path="url(#${id}-half)">${unitedStates}</g>
      <path d="M32 0 0 32" stroke="#FFF" stroke-width="1.6"/>
    </g>`,
});

export function flag(code, size = 28) {
  const draw = FLAGS[code];
  if (!draw) return '';
  instance += 1;
  return raw(
    `<svg class="flag" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${draw(`flag-${code}-${instance}`)}</svg>`,
  );
}
