import { Component } from '../Component.js';
import { html } from '../../utils/html.js';

// Lista de proyectos con filtro por categoría. Las categorías salen de los datos,
// así un proyecto de un tipo nuevo agrega su filtro sin tocar este componente
// (solo hace falta su etiqueta en projects.filters de cada idioma).

const ALL = 'all';

export class Projects extends Component {
  #projects;
  #card;
  #filter = ALL;

  constructor({ projects, card, ...deps }) {
    super(deps);
    this.#projects = projects;
    this.#card = card;
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      this.#filter = button.dataset.filter;
      this.#applyFilter();
    });
  }

  template() {
    const categories = [ALL, ...new Set(this.#projects.map((project) => project.category))];
    return html`
      <div class="container">
        <header class="section-head section-head--split">
          <h2 class="section-title">${this.t('projects.title')}</h2>
          <p class="section-intro">${this.t('projects.intro')}</p>
        </header>
        <div class="project-filters" role="group" aria-label="${this.t('projects.filterLabel')}">
          ${categories.map(
            (category) => html`
              <button type="button" class="project-filter" data-filter="${category}" aria-pressed="${category === this.#filter}">
                ${this.t(`projects.filters.${category}`)}
                <span class="project-filter__count">${this.#count(category)}</span>
              </button>
            `,
          )}
        </div>
        <div class="project-grid">
          ${this.#projects.map((project) => this.#card.render(project))}
        </div>
      </div>
    `;
  }

  afterRender() {
    this.#applyFilter();
  }

  #count(category) {
    return category === ALL
      ? this.#projects.length
      : this.#projects.filter((project) => project.category === category).length;
  }

  #applyFilter() {
    this.root.querySelectorAll('[data-filter]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === this.#filter));
    });
    this.root.querySelectorAll('[data-category]').forEach((card) => {
      card.hidden = this.#filter !== ALL && card.dataset.category !== this.#filter;
    });
  }
}
