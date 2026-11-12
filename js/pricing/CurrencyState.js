// Estado de la moneda en la que se muestran los precios.
// Los precios se guardan en pesos colombianos (COP) y se convierten con las tasas del día.
// Si el visitante no ha elegido una moneda, se usa la de su idioma (es → COP, en → USD).

const ROUNDING = Object.freeze({ COP: 1000, USD: 5, EUR: 5, MXN: 50 });

export class CurrencyState {
  #base;
  #currencies;
  #defaults;
  #chosen;
  #rates = null;
  #updatedAt = null;
  #listeners = new Set();

  constructor({ base = 'COP', currencies, defaults, chosen = null }) {
    this.#base = base;
    this.#currencies = currencies;
    this.#defaults = defaults;
    this.#chosen = currencies.includes(chosen) ? chosen : null;
  }

  get base() {
    return this.#base;
  }

  /** Moneda elegida a mano por el visitante (null si no ha elegido). */
  get chosen() {
    return this.#chosen;
  }

  get hasRates() {
    return this.#rates !== null;
  }

  get updatedAt() {
    return this.#updatedAt;
  }

  /** Monedas que se pueden mostrar ahora (sin tasas, solo la base). */
  available() {
    return this.hasRates ? this.#currencies.filter((code) => code === this.#base || code in this.#rates) : [this.#base];
  }

  /** Moneda activa para el idioma dado. */
  current(locale) {
    const options = this.available();
    const wanted = this.#chosen ?? this.#defaults[locale] ?? this.#base;
    return options.includes(wanted) ? wanted : this.#base;
  }

  choose(code) {
    if (!this.#currencies.includes(code)) return;
    this.#chosen = code;
    this.#notify();
  }

  setRates({ rates, updatedAt }) {
    this.#rates = rates;
    this.#updatedAt = updatedAt;
    this.#notify();
  }

  /** Convierte un valor en la moneda base y lo redondea a una cifra limpia. */
  convert(value, code) {
    if (code === this.#base) return value;
    const rate = this.#rates?.[code];
    if (!rate) return null;
    const step = ROUNDING[code] ?? 1;
    return Math.max(step, Math.round((value * rate) / step) * step);
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    this.#listeners.forEach((listener) => listener(this));
  }
}
