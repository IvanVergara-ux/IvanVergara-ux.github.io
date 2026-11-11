import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { icons } from '../icons.js';

// Acceso directo a WhatsApp. Se oculta mientras se ve alguna de las secciones vigiladas
// (la portada y el contacto ya tienen su propio botón de WhatsApp).

export class FloatingContact extends Component {
  #whatsApp;
  #watch;
  #observer = null;
  #visibleSections = new Set();

  constructor({ whatsApp, watch = [], ...deps }) {
    super(deps);
    this.#whatsApp = whatsApp;
    this.#watch = watch.filter(Boolean);
  }

  template() {
    return html`
      <a class="floating-contact" href="${this.#whatsApp.build(this.t('hero.message'))}" target="_blank" rel="noopener noreferrer"
        aria-label="${this.t('a11y.floating')}">
        <span class="floating-contact__icon">${icons.chat(20)}</span>
        <span class="floating-contact__label">${this.t('a11y.floatingShort')}</span>
      </a>
    `;
  }

  beforeRender() {
    this.#observer?.disconnect();
    this.#visibleSections.clear();
  }

  afterRender() {
    if (!this.#watch.length || !('IntersectionObserver' in window)) {
      this.root.classList.add('is-visible');
      return;
    }
    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) this.#visibleSections.add(entry.target);
        else this.#visibleSections.delete(entry.target);
      });
      this.root.classList.toggle('is-visible', this.#visibleSections.size === 0);
    }, { threshold: 0.15 });
    this.#watch.forEach((section) => this.#observer.observe(section));
  }
}
