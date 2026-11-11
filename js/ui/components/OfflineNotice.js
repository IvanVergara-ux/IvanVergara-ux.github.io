import { Component } from '../Component.js';
import { html } from '../../utils/html.js';

// Aviso discreto cuando el visitante pierde la conexión a internet.
// La página sigue funcionando; solo avisa que WhatsApp y los enlaces externos necesitan conexión.

export class OfflineNotice extends Component {
  #isOnline;

  constructor({ isOnline = () => true, ...deps }) {
    super(deps);
    this.#isOnline = isOnline;
  }

  bindEvents() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => this.render());
    window.addEventListener('offline', () => this.render());
  }

  template() {
    if (this.#isOnline()) return html``;
    return html`
      <p class="offline-notice" role="status">
        <span class="offline-notice__dot" aria-hidden="true"></span>
        ${this.t('offline.message')}
      </p>
    `;
  }
}
