import { Component } from '../Component.js';
import { html } from '../../utils/html.js';
import { safeUrl } from '../../utils/url.js';
import { icons } from '../icons.js';
import { flag } from '../flags.js';

export class Header extends Component {
  #person;
  #brand;
  #navigation;
  #languageNames;
  #menuOpen = false;
  #activeHref = null;
  #localeToFocus = null;

  constructor({ person, brand, navigation, languages = [], ...deps }) {
    super(deps);
    this.#person = person;
    this.#brand = brand;
    this.#navigation = navigation;
    this.#languageNames = Object.fromEntries(languages.map((language) => [language.code, language.name]));
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => {
      const localeButton = event.target.closest('[data-locale]');
      if (localeButton) {
        this.#localeToFocus = localeButton.dataset.locale;
        this.i18n.setLocale(localeButton.dataset.locale);
        return;
      }
      if (event.target.closest('[data-menu-toggle]')) {
        this.#setMenu(!this.#menuOpen);
        return;
      }
      if (event.target.closest('a[href^="#"]')) this.#setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !this.#menuOpen) return;
      this.#setMenu(false);
      this.root.querySelector('[data-menu-toggle]')?.focus();
    });
  }

  /** Marca en el menú la sección que se está viendo. */
  setActiveSection(id) {
    this.#activeHref = id ? `#${id}` : null;
    this.root.querySelectorAll('.topbar__links a').forEach((link) => {
      if (link.getAttribute('href') === this.#activeHref) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  template() {
    return html`
      <a class="skip-link" href="#main">${this.t('a11y.skip')}</a>
      <div class="container topbar">
        <a class="brand" href="#inicio" aria-label="${this.#person.fullName}">
          <img class="brand__mark" src="${safeUrl(this.#brand.logo)}" alt="" width="34" height="34">
          <span class="brand__name">${this.#person.shortName}</span>
        </a>
        <nav class="topbar__nav" id="menu-principal" aria-label="${this.t('a11y.nav')}">
          <ul class="topbar__links">
            ${this.#navigation.map(
              (item) => html`<li><a href="${safeUrl(item.href)}" ${item.href === this.#activeHref ? 'aria-current="true"' : ''}>${this.t(item.key)}</a></li>`,
            )}
          </ul>
        </nav>
        <div class="topbar__actions">
          <div class="lang-switch" role="group" aria-label="${this.t('a11y.language')}">
            ${this.i18n.locales.map(
              (locale) => html`
                <button type="button" class="lang-switch__option" data-locale="${locale}"
                  aria-pressed="${locale === this.i18n.locale}" lang="${locale}"
                  aria-label="${this.#languageNames[locale] ?? locale}" title="${this.#languageNames[locale] ?? locale}">
                  ${flag(locale, 20)}<span class="lang-switch__code" aria-hidden="true">${locale.toUpperCase()}</span>
                </button>
              `,
            )}
          </div>
          <a class="button button--dark button--sm topbar__cta" href="#contacto">${this.t('nav.contact')}</a>
          <button type="button" class="topbar__toggle" data-menu-toggle aria-controls="menu-principal" aria-expanded="false">
            <span class="visually-hidden" data-menu-label>${this.t('a11y.openMenu')}</span>
            <span data-menu-icon>${icons.menu()}</span>
          </button>
        </div>
      </div>
      <span class="topbar__progress" aria-hidden="true"></span>
    `;
  }

  beforeRender() {
    this.#menuOpen = false;
    this.root.classList.remove('is-menu-open');
  }

  afterRender() {
    if (!this.#localeToFocus) return;
    this.root.querySelector(`[data-locale="${this.#localeToFocus}"]`)?.focus();
    this.#localeToFocus = null;
  }

  #setMenu(open) {
    this.#menuOpen = open;
    this.root.classList.toggle('is-menu-open', open);
    const toggle = this.root.querySelector('[data-menu-toggle]');
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-menu-label]').textContent = this.t(open ? 'a11y.closeMenu' : 'a11y.openMenu');
    toggle.querySelector('[data-menu-icon]').innerHTML = (open ? icons.close() : icons.menu()).toString();
  }
}
