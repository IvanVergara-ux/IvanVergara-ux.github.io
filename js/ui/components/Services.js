import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { icons } from '../icons.js';
import { emblem } from '../emblems.js';
import { formatPrice } from '../../utils/money.js';

// Explorador de servicios con el patrón de pestañas accesible (flechas, Inicio y Fin).
// Al cambiar de pestaña o de moneda solo se actualizan atributos y textos: no se repinta el componente.

const KEY_STEPS = Object.freeze({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 });

export class Services extends Component {
  #services;
  #whatsApp;
  #activeId;
  #currency;

  constructor({ services, whatsApp, currency, ...deps }) {
    super(deps);
    this.#services = services;
    this.#whatsApp = whatsApp;
    this.#currency = currency;
    this.#activeId = services[0]?.id;
    currency.subscribe(() => this.#refreshPrices());
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => {
      const option = event.target.closest('[data-currency]');
      if (option) {
        this.#currency.choose(option.dataset.currency);
        return;
      }
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
        ${service.priceFrom ? this.#price(service.priceFrom) : ''}
        <a class="button button--primary" href="${href}" target="_blank" rel="noopener noreferrer"
          aria-label="${this.t('services.quoteLabel', { service: quote })}">
          ${this.t('services.quote')} ${icons.arrow(18)}
        </a>
      </section>
    `;
  }

  #price(value) {
    const code = this.#currency.current(this.i18n.locale);
    const converted = code !== this.#currency.base;
    return html`
      <div class="service-panel__price">
        <span>${this.t('services.priceFrom')}</span>
        <strong data-price="${value}" title="${this.#conversions(value)}">${this.#priceText(value, code)}</strong>
        <div class="currency-switch" role="group" aria-label="${this.t('services.viewIn')}"
          ${this.#currency.hasRates ? '' : 'hidden'}>
          <span class="currency-switch__label">${this.t('services.viewIn')}</span>
          ${this.#currency.available().map((option) => html`
            <button type="button" class="currency-switch__option" data-currency="${option}"
              aria-pressed="${option === code}">${option}</button>`)}
        </div>
        <small class="service-panel__rate" data-rate-note ${converted ? '' : 'hidden'}>
          ${this.t('services.approx')}
          <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">${this.t('services.ratesBy')}</a>
        </small>
        <small>${this.t('services.priceNote')}</small>
        <small class="service-panel__payment">${this.t('services.payment')}</small>
      </div>
    `;
  }

  #priceText(value, code) {
    const amount = this.#currency.convert(value, code);
    const text = formatPrice(amount, code, this.i18n.locale);
    return code === this.#currency.base ? text : `≈ ${text}`;
  }

  /** Texto al pasar el cursor: el precio en las demás monedas. */
  #conversions(value) {
    if (!this.#currency.hasRates) return '';
    return this.#currency.available()
      .map((code) => this.#priceText(value, code))
      .join(' · ');
  }

  #refreshPrices() {
    const code = this.#currency.current(this.i18n.locale);
    const converted = code !== this.#currency.base;
    this.root.querySelectorAll('[data-price]').forEach((element) => {
      const value = Number(element.dataset.price);
      element.textContent = this.#priceText(value, code);
      element.title = this.#conversions(value);
    });
    this.root.querySelectorAll('.currency-switch').forEach((group) => {
      if (group.hidden && this.#currency.hasRates) {
        group.hidden = false;
        group.querySelectorAll('[data-currency]').forEach((button) => button.remove());
        for (const option of this.#currency.available()) {
          group.insertAdjacentHTML('beforeend', html`<button type="button" class="currency-switch__option"
            data-currency="${option}" aria-pressed="false">${option}</button>`.toString());
        }
      }
      group.querySelectorAll('[data-currency]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.currency === code));
      });
    });
    this.root.querySelectorAll('[data-rate-note]').forEach((note) => {
      note.hidden = !converted;
    });
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
