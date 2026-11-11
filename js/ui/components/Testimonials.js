import { Component } from '../Component.js';
import { html } from '../../utils/html.js';

// Opiniones de clientes. Si no hay ninguna, no pinta nada y la sección queda oculta.

export class Testimonials extends Component {
  #items;

  constructor({ items, ...deps }) {
    super(deps);
    this.#items = items;
  }

  get isEmpty() {
    return this.#items.length === 0;
  }

  template() {
    if (this.isEmpty) return html``;
    return html`
      <div class="container">
        <header class="section-head section-head--split">
          <h2 class="section-title">${this.t('testimonials.title')}</h2>
          <p class="section-intro">${this.t('testimonials.intro')}</p>
        </header>
        <ul class="testimonials">
          ${this.#items.map(
            (item) => html`
              <li class="testimonial">
                <blockquote class="testimonial__quote">${this.pick(item.quote)}</blockquote>
                <p class="testimonial__author">
                  <span class="testimonial__initial" aria-hidden="true">${item.name.charAt(0)}</span>
                  <span>
                    <strong>${item.name}</strong>
                    <span>${this.pick(item.role)}${item.project ? html`, ${item.project}` : ''}</span>
                  </span>
                </p>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  afterRender() {
    this.root.hidden = this.isEmpty;
  }
}
