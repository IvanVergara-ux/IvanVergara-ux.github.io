// Descarga las tasas de cambio del día (ExchangeRate-API, acceso abierto, se actualiza una vez al día)
// y las guarda en el navegador hasta la siguiente actualización, para no pedirlas en cada visita.
// Si la red falla se usa la copia guardada; si no hay ninguna, devuelve null y la página muestra solo COP.

export class ExchangeRates {
  #url;
  #fetch;
  #storage;
  #key;
  #now;

  constructor({ url, fetch = globalThis.fetch?.bind(globalThis), storage, key = 'portfolio.rates', now = () => Date.now() }) {
    this.#url = url;
    this.#fetch = fetch;
    this.#storage = storage;
    this.#key = key;
    this.#now = now;
  }

  async load(codes) {
    const cached = this.#read();
    if (cached && cached.expiresAt > this.#now()) return this.#pick(cached, codes);

    try {
      const response = await this.#fetch(this.#url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.result !== 'success' || !data.rates) throw new Error('Respuesta inválida');
      const fresh = {
        rates: data.rates,
        updatedAt: data.time_last_update_unix * 1000,
        expiresAt: data.time_next_update_unix * 1000,
      };
      this.#write(fresh);
      return this.#pick(fresh, codes);
    } catch {
      return cached ? this.#pick(cached, codes) : null;
    }
  }

  #pick({ rates, updatedAt }, codes) {
    const selected = {};
    for (const code of codes) {
      const rate = Number(rates[code]);
      if (Number.isFinite(rate) && rate > 0) selected[code] = rate;
    }
    return { rates: selected, updatedAt };
  }

  #read() {
    try {
      const value = JSON.parse(this.#storage?.getItem(this.#key) ?? 'null');
      return value && typeof value.rates === 'object' ? value : null;
    } catch {
      return null;
    }
  }

  #write(value) {
    try {
      this.#storage?.setItem(this.#key, JSON.stringify(value));
    } catch {
      // Sin almacenamiento: se vuelven a pedir en la próxima visita.
    }
  }
}
