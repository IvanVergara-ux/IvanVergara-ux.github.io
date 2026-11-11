import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { icons } from '../icons.js';
import { avatar } from './Avatar.js';
import { codeWindow } from './CodeWindow.js';
import { statWithDetails } from './StatDetails.js';

export class Hero extends Component {
  #person;
  #logo;
  #words;
  #trustPoints;
  #stats;
  #whatsApp;
  #createRotator;
  #countUp;
  #rotators = [];

  constructor({ person, logo, words, trustPoints, stats, whatsApp, createRotator, countUp, ...deps }) {
    super(deps);
    this.#person = person;
    this.#logo = logo;
    this.#words = words;
    this.#trustPoints = trustPoints;
    this.#stats = stats;
    this.#whatsApp = whatsApp;
    this.#createRotator = createRotator;
    this.#countUp = countUp;
  }

  bindEvents() {
    // Antes de mostrar un panel se decide si cabe arriba; si no, se abre hacia abajo
    const placeFrom = (event) => {
      const stat = event.target.closest?.('[data-stat]');
      if (stat) this.#placePanel(stat);
    };
    this.root.addEventListener('mouseover', placeFrom);
    this.root.addEventListener('focusin', placeFrom);

    this.root.addEventListener('click', (event) => {
      const trigger = event.target.closest('.stat__trigger');
      if (!trigger) return;
      const stat = trigger.closest('[data-stat]');
      this.#placePanel(stat);
      this.#toggleStat(stat.classList.contains('is-open') ? null : stat);
    });

    // Cerrar al hacer clic fuera o con Escape
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-stat]')) this.#toggleStat(null);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = this.root.querySelector('[data-stat].is-open');
      if (!open) return;
      this.#toggleStat(null);
      open.querySelector('.stat__trigger')?.focus();
    });
  }

  template() {
    const name = this.#person.fullName;
    return html`
      <div class="hero__grid-bg" aria-hidden="true"></div>
      <div class="container hero__layout">
        <div class="hero__copy">
          <p class="hero__badge">
            ${avatar({ person: this.#person, logo: this.#logo, label: this.t('a11y.photo', { name }) })}
            <span><strong>${name}</strong><span>${this.t('hero.role')}</span></span>
          </p>

          <h1 class="hero__title">
            <span class="visually-hidden">${this.t('hero.titleFull')}</span>
            <span class="hero__prefix" aria-hidden="true">${this.t('hero.titlePrefix')}</span>
            <span class="hero__rotating" aria-hidden="true" data-rotator></span>
          </h1>

          <p class="hero__text">${this.t('hero.text')}</p>

          <div class="hero__actions">
            <a class="button button--primary button--lg" href="${this.#whatsApp.build(this.t('hero.message'))}" target="_blank" rel="noopener noreferrer">
              ${icons.chat()} ${this.t('hero.primary')}
            </a>
            <a class="arrow-link" href="#proyectos">${this.t('hero.secondary')} ${icons.arrow(18)}</a>
          </div>

          <ul class="hero__trust">
            ${this.#trustPoints.map((point) => html`<li>${icons.check(16)} ${this.pick(point)}</li>`)}
          </ul>
        </div>

        <div class="hero__visual">
          ${codeWindow((key) => this.t(key))}
        </div>
      </div>

      <div class="container">
        <ul class="hero__stats">
          ${this.#stats.map((stat) => statWithDetails(stat, { t: (key) => this.t(key), pick: (value) => this.pick(value) }))}
        </ul>
      </div>
    `;
  }

  beforeRender() {
    this.#rotators.forEach((rotator) => rotator.stop());
    this.#rotators = [];
    this.#countUp.disconnect();
  }

  afterRender() {
    const words = this.pick(this.#words);
    this.#rotators = [...this.root.querySelectorAll('[data-rotator]')].map((element) =>
      this.#createRotator({ element, words }),
    );
    this.#rotators.forEach((rotator) => rotator.start());
    this.#countUp.observe(this.root.querySelectorAll('[data-count]'));
  }

  #placePanel(stat) {
    const panel = stat.querySelector('.stat__panel');
    if (!panel) return;
    const headerHeight = document.getElementById('site-header')?.offsetHeight ?? 0;
    const spaceAbove = stat.getBoundingClientRect().top - headerHeight;
    stat.classList.toggle('opens-down', spaceAbove < panel.offsetHeight + 16);
  }

  /** Abre el panel de una cifra (o ninguno con null) y mantiene aria-expanded al día. */
  #toggleStat(statToOpen) {
    this.root.querySelectorAll('[data-stat]').forEach((stat) => {
      const open = stat === statToOpen;
      stat.classList.toggle('is-open', open);
      stat.querySelector('.stat__trigger')?.setAttribute('aria-expanded', String(open));
    });
  }
}
