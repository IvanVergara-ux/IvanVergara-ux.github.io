import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { emblem } from '../emblems.js';

export class Commitments extends Component {
  #items;

  constructor({ items, ...deps }) {
    super(deps);
    this.#items = items;
  }

  template() {
    return html`
      <div class="container">
        <header class="section-head section-head--split">
          <h2 class="section-title">${this.t('commitments.title')}</h2>
          <p class="section-intro">${this.t('commitments.intro')}</p>
        </header>
        <ul class="commitments">
          ${this.#items.map(
            (item) => html`
              <li class="commitment">
                ${emblem(item.icon, { tone: 'night', size: 40 })}
                <h3 class="commitment__title">${this.pick(item.title)}</h3>
                <p>${this.pick(item.text)}</p>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }
}
