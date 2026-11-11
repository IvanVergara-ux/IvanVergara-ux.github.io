import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { icons } from '../icons.js';

// Usa <details>/<summary>: accesible con teclado y lector de pantalla sin JavaScript extra.

export class Faq extends Component {
  #items;

  constructor({ items, ...deps }) {
    super(deps);
    this.#items = items;
  }

  template() {
    return html`
      <div class="container faq">
        <header class="faq__head">
          <h2 class="section-title">${this.t('faq.title')}</h2>
          <p class="section-intro">${this.t('faq.intro')}</p>
        </header>
        <div class="faq__list">
          ${this.#items.map(
            (item) => html`
              <details class="faq__item">
                <summary>
                  <span>${this.pick(item.q)}</span>
                  <span class="faq__icon">${icons.plus(18)}</span>
                </summary>
                <p>${this.pick(item.a)}</p>
              </details>
            `,
          )}
        </div>
      </div>
    `;
  }
}
