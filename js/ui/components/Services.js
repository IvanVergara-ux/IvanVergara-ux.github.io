import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { icons } from '../icons.js';
import { emblem } from '../emblems.js';

// Explorador de servicios con el patrón de pestañas accesible (flechas, Inicio y Fin).
// Al cambiar de pestaña solo se alternan atributos: no se repinta el componente.

const KEY_STEPS = Object.freeze({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 });

export class Services extends Component {
  #services;
  #whatsApp;
  #activeId;

  constructor({ services, whatsApp, ...deps }) {
    super(deps);
    this.#services = services;
    this.#whatsApp = whatsApp;
    this.#activeId = services[0]?.id;
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => {
      const tab = event.target.closest('[role="tab"]');
      if (tab) this.#select(tab.dataset.service);
    });

    this.root.addEventListener('keydown', (event) => {
      if (!event.target.matches('[role="tab"]')) return;
      const ids = this.#services.map((service) => service.id);
      const current = ids.indexOf(this.#activeId);
      let next = null;
      if (event.key in KEY_STEPS) next = (current + KEY_STEPS[event.key] + ids.length) % ids.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = ids.length - 1;
      if (next === null) return;
      event.preventDefault();
      this.#select(ids[next], { focus: true });
    });
  }

  template() {
    return html`
      <div class="container">
        <header class="section-head section-head--split">
          <h2 class="section-title">${this.t('services.title')}</h2>
          <p class="section-intro">${this.t('services.intro')}</p>
        </header>
        <div class="service-tabs">
          <div class="service-tabs__list" role="tablist" aria-label="${this.t('services.tabs')}" aria-orientation="vertical">
            ${this.#services.map((service) => this.#tab(service))}
          </div>
          ${this.#services.map((service) => this.#panel(service))}
        </div>
      </div>
    `;
  }

  #tab(service) {
    const selected = service.id === this.#activeId;
    return html`
      <button type="button" role="tab" class="service-tab" id="tab-${service.id}" data-service="${service.id}"
        aria-controls="panel-${service.id}" aria-selected="${selected}" tabindex="${selected ? 0 : -1}">
        <span class="service-tab__icon">${emblem(service.icon, { size: 26 })}</span>
        <span class="service-tab__title">${this.pick(service.title)}</span>
        <span class="service-tab__chevron">${icons.arrow(16)}</span>
      </button>
    `;
  }

  #panel(service) {
    const quote = this.pick(service.quote);
    const href = this.#whatsApp.build(this.t('services.message', { service: quote }));
    return html`
      <section class="service-panel" role="tabpanel" id="panel-${service.id}" aria-labelledby="tab-${service.id}"
        ${service.id === this.#activeId ? '' : 'hidden'}>
        <span class="service-panel__icon">${emblem(service.icon, { size: 40 })}</span>
        <h3 class="service-panel__title">${this.pick(service.title)}</h3>
        <p class="service-panel__text">${this.pick(service.text)}</p>
        <h4 class="service-panel__label">${this.t('services.includes')}</h4>
        <ul class="service-panel__includes">
          ${service.includes.map((item) => html`<li>${icons.check(16)} ${this.pick(item)}</li>`)}
        </ul>
        <p class="service-panel__fit"><strong>${this.t('services.fit')}:</strong> ${this.pick(service.fit)}</p>
        <a class="button button--primary" href="${href}" target="_blank" rel="noopener noreferrer"
          aria-label="${this.t('services.quoteLabel', { service: quote })}">
          ${this.t('services.quote')} ${icons.arrow(18)}
        </a>
      </section>
    `;
  }

  #select(id, { focus = false } = {}) {
    this.#activeId = id;
    this.root.querySelectorAll('[role="tab"]').forEach((tab) => {
      const selected = tab.dataset.service === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    this.root.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
      panel.hidden = panel.id !== `panel-${id}`;
    });
  }
}
