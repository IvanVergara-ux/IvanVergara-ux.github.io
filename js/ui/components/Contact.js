import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';
import { icons } from '../icons.js';

export class Contact extends Component {
  #contact;
  #whatsApp;
  #composer;

  constructor({ contact, whatsApp, composer, ...deps }) {
    super(deps);
    this.#contact = contact;
    this.#whatsApp = whatsApp;
    this.#composer = composer;
  }

  bindEvents() {
    this.root.addEventListener('change', (event) => this.#composer?.handleChange(event));
  }

  template() {
    const { email, github, whatsapp } = this.#contact;
    return html`
      <div class="container">
        <div class="contact-card">
          <div class="contact-card__copy">
            <h2 class="contact-card__title">${this.t('contact.title')}</h2>
            <p class="contact-card__text">${this.t('contact.text')}</p>
            <ul class="contact-card__details">
              <li>
                ${icons.chat(18)}
                <span>${this.t('contact.whatsapp')}</span>
                <a class="text-link" href="${this.#whatsApp.build()}" target="_blank" rel="noopener noreferrer">${whatsapp}</a>
              </li>
              <li>
                ${icons.mail(18)}
                <span>${this.t('contact.email')}</span>
                <a class="text-link" href="${safeUrl(`mailto:${email}`)}">${email}</a>
              </li>
              ${github
                ? html`<li>${icons.code(18)}<span>${this.t('contact.github')}</span><a class="text-link" href="${safeUrl(github)}" target="_blank" rel="noopener noreferrer">${github.replace(/^https?:\/\//, '')}</a></li>`
                : ''}
            </ul>
          </div>
          ${this.#composer.template()}
        </div>
      </div>
    `;
  }

  afterRender() {
    this.#composer.attach(this.root);
  }
}
