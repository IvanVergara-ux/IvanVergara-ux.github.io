// Servicio de idioma: guarda el idioma activo, traduce claves y avisa a quien se suscriba.
// No sabe nada del DOM ni de dónde se guarda la preferencia (eso lo hace LocalePreference).

export class I18n {
  #dictionaries;
  #fallback;
  #locale;
  #listeners = new Set();

  constructor({ dictionaries, fallback }) {
    if (!dictionaries[fallback]) throw new Error(`No existe el idioma de respaldo "${fallback}"`);
    this.#dictionaries = dictionaries;
    this.#fallback = fallback;
    this.#locale = fallback;
  }

  get locale() {
    return this.#locale;
  }

  get locales() {
    return Object.keys(this.#dictionaries);
  }

  supports(locale) {
    return Object.hasOwn(this.#dictionaries, locale);
  }

  setLocale(locale) {
    if (!this.supports(locale) || locale === this.#locale) return;
    this.#locale = locale;
    this.#listeners.forEach((listener) => listener(locale));
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  /** Traduce una clave tipo "hero.title" y reemplaza {parametros}. */
  t(key, params = {}) {
    const text = this.#lookup(this.#locale, key) ?? this.#lookup(this.#fallback, key) ?? key;
    return text.replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
  }

  /** Elige la versión del idioma activo en un objeto { es: '...', en: '...' }. */
  pick(localized) {
    if (typeof localized === 'string') return localized;
    return localized?.[this.#locale] ?? localized?.[this.#fallback] ?? '';
  }

  #lookup(locale, key) {
    const value = key.split('.').reduce((node, part) => node?.[part], this.#dictionaries[locale]);
    return typeof value === 'string' ? value : undefined;
  }
}
