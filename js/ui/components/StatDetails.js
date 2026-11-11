import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';
import { emblem } from '../emblems.js';
import { flag } from '../flags.js';

// Cifra de la portada con su panel de detalle. Funciones puras: reciben t() y pick().

// Iniciales: dos letras de una sola palabra ("Room" → "RO") o la inicial de cada palabra ("Factory Method" → "FM")
const initials = (label) => {
  const words = label.split(/[\s.]+/).filter(Boolean);
  const letters = words.length > 1 ? words.map((word) => word[0]).join('') : words[0] ?? '';
  return letters.slice(0, 2).toUpperCase();
};

function itemMark(item, label) {
  if (item.logo) return html`<img class="stat-item__logo" src="${safeUrl(item.logo)}" alt="" width="22" height="22" loading="lazy">`;
  if (item.flag) return flag(item.flag, 26);
  if (item.emblem) return emblem(item.emblem, { tone: item.tone, size: 28 });
  return html`<span class="stat-item__badge" aria-hidden="true">${item.badge ?? initials(label)}</span>`;
}

function statItem(item, pick) {
  const label = pick(item.label);
  return html`
    <li class="stat-item">
      ${itemMark(item, label)}
      <span class="stat-item__text">
        <span class="stat-item__label">${label}</span>
        ${item.detail ? html`<span class="stat-item__detail">${pick(item.detail)}</span>` : ''}
      </span>
    </li>
  `;
}

export function statWithDetails(stat, { t, pick }) {
  const panelId = `stat-panel-${stat.id}`;
  return html`
    <li class="stat" data-stat>
      <button type="button" class="stat__trigger" aria-expanded="false" aria-controls="${panelId}">
        <span class="stat__value" data-count="${stat.value}">${stat.value}</span>
        <span class="stat__label">${t(stat.labelKey)}<span class="stat__more" aria-hidden="true">+</span></span>
      </button>
      <div class="stat__panel" id="${panelId}" role="group" aria-label="${t(stat.titleKey)}">
        <p class="stat__panel-title">${t(stat.titleKey)}</p>
        <ul class="stat__items stat__items--${stat.layout}">
          ${stat.items.map((item) => statItem(item, pick))}
        </ul>
      </div>
    </li>
  `;
}
