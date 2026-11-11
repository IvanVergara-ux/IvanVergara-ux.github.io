import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { emblem } from '../emblems.js';

export class Process extends Component {
  #steps;

  constructor({ steps, ...deps }) {
    super(deps);
    this.#steps = steps;
  }

  template() {
    return html`
      <div class="container">
        <header class="section-head section-head--split">
          <h2 class="section-title">${this.t('process.title')}</h2>
          <p class="section-intro">${this.t('process.intro')}</p>
        </header>
        <ol class="steps">
          ${this.#steps.map(
            (step, index) => html`
              <li class="step">
                ${emblem(step.emblem, { tone: index === this.#steps.length - 1 ? 'night' : 'mint', size: 40 })}
                <div class="step__text">
                  <h3 class="step__title">${this.pick(step.title)}</h3>
                  <p>${this.pick(step.text)}</p>
                </div>
              </li>
            `,
          )}
        </ol>
      </div>
    `;
  }
}
