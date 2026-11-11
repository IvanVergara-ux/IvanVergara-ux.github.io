import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';

export class Footer extends Component {
  #person;
  #brand;
  #contact;
  #navigation;
  #whatsApp;
  #year;

  constructor({ person, brand, contact, navigation, whatsApp, year = new Date().getFullYear(), ...deps }) {
    super(deps);
    this.#person = person;
    this.#brand = brand;
    this.#contact = contact;
    this.#navigation = navigation;
    this.#whatsApp = whatsApp;
    this.#year = year;
  }

  template() {
    const { email, github, whatsapp } = this.#contact;
    return html`
      <div class="container">
        <div class="site-footer__grid">
          <div class="site-footer__brand">
            <p class="brand">
              <img class="brand__mark" src="${safeUrl(this.#brand.logo)}" alt="" width="32" height="32">
              <span class="brand__name">${this.#person.fullName}</span>
            </p>
            <p>${this.t('footer.tagline')}</p>
          </div>
          <nav aria-label="${this.t('footer.navTitle')}">
            <h2 class="site-footer__heading">${this.t('footer.navTitle')}</h2>
            <ul>
              ${this.#navigation.map((item) => html`<li><a href="${safeUrl(item.href)}">${this.t(item.key)}</a></li>`)}
            </ul>
          </nav>
          <div>
            <h2 class="site-footer__heading">${this.t('footer.contactTitle')}</h2>
            <ul>
              <li><a href="${this.#whatsApp.build()}" target="_blank" rel="noopener noreferrer">${whatsapp}</a></li>
              <li><a href="${safeUrl(`mailto:${email}`)}">${email}</a></li>
              ${github ? html`<li><a href="${safeUrl(github)}" target="_blank" rel="noopener noreferrer">GitHub</a></li>` : ''}
            </ul>
          </div>
        </div>
        <div class="site-footer__bottom">
          <p>© ${this.#year} ${this.#person.fullName}</p>
          <p>${this.t('footer.credit', { name: this.#person.fullName })}</p>
        </div>
      </div>
    `;
  }
}
