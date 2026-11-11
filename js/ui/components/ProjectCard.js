import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';
import { icons } from '../icons.js';

// Pinta un solo proyecto. Recibe el proyecto y el servicio de idioma; no conoce la lista completa.

export class ProjectCard {
  #i18n;

  constructor({ i18n }) {
    this.#i18n = i18n;
  }

  render(project) {
    const t = (key) => this.#i18n.t(key);
    const pick = (value) => this.#i18n.pick(value);
    const title = pick(project.title);

    return html`
      <article class="project" data-category="${project.category}" aria-labelledby="titulo-${project.id}">
        ${this.#preview(project, title)}
        <div class="project__body">
          <p class="project__kind">${pick(project.kind)}</p>
          <h3 class="project__title" id="titulo-${project.id}">${title}</h3>
          <p class="project__summary">${pick(project.summary)}</p>
          <p class="project__role">${pick(project.role)}</p>
          <ul class="project__stack">
            ${project.stack.map((tech) => html`<li>${tech}</li>`)}
          </ul>
          <ul class="project__tags">
            ${project.tags.map((tag) => html`<li>${t(`projects.tags.${tag}`)}</li>`)}
          </ul>
          ${this.#links(project)}
        </div>
      </article>
    `;
  }

  #preview(project, title) {
    if (project.image) {
      return html`
        <div class="project__preview">
          <img src="${safeUrl(project.image)}" alt="${title}" width="1200" height="750" loading="lazy" decoding="async">
        </div>
      `;
    }
    return html`
      <div class="project__preview project__preview--${project.device}" aria-hidden="true">
        <div class="device device--${project.device}">
          <span class="device__label">${title}</span>
        </div>
      </div>
    `;
  }

  #links(project) {
    const items = [
      project.links.demo && { href: project.links.demo, key: 'projects.demo' },
      project.links.repo && { href: project.links.repo, key: 'projects.repo' },
    ].filter(Boolean);

    if (!items.length) return '';
    return html`
      <p class="project__links">
        ${items.map(
          (link) => html`<a class="text-link" href="${safeUrl(link.href)}" target="_blank" rel="noopener noreferrer">${this.#i18n.t(link.key)} ${icons.external(16)}</a>`,
        )}
      </p>
    `;
  }
}
