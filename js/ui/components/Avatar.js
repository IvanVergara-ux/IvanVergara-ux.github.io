import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';

// Foto si existe; si no, el logo; si tampoco hay logo, las iniciales. Función pura: no guarda estado.
export function avatar({ person, logo, label }) {
  if (person.photo) return html`<img class="avatar" src="${safeUrl(person.photo)}" alt="${label}" width="88" height="88">`;
  if (logo) return html`<img class="avatar avatar--logo" src="${safeUrl(logo)}" alt="" width="88" height="88">`;
  return html`<span class="avatar avatar--initials" role="img" aria-label="${label}">${person.initials}</span>`;
}
