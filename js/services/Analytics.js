// Estadísticas de visitas con GoatCounter (gratis, sin cookies, sin datos personales).
// Se envían con una imagen invisible: no se carga ningún script de terceros.
//
// No cuenta nada si: no hay código configurado, la página corre en local (Live Server),
// no es https, o el visitante activó "No rastrear" en su navegador.

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export class Analytics {
  #endpoint;
  #win;

  constructor({ code, win = window }) {
    this.#endpoint = code ? `https://${code}.goatcounter.com/count` : null;
    this.#win = win;
  }

  get enabled() {
    if (!this.#endpoint) return false;
    const { location, navigator } = this.#win;
    if (location.protocol !== 'https:' || LOCAL_HOSTS.has(location.hostname)) return false;
    return navigator.doNotTrack !== '1' && this.#win.doNotTrack !== '1';
  }

  /** Una visita a la página. */
  pageview() {
    const { location, document } = this.#win;
    this.#send({ p: location.pathname, t: document.title, r: document.referrer });
  }

  /** Una acción, por ejemplo "whatsapp/inicio". */
  event(name) {
    this.#send({ p: name, t: name, e: 'true' });
  }

  #send(params) {
    if (!this.enabled) return;
    const { screen } = this.#win;
    const query = new URLSearchParams({
      ...params,
      s: `${screen.width},${screen.height},${this.#win.devicePixelRatio || 1}`,
      rnd: Math.random().toString(36).slice(2),
    });
    const pixel = new this.#win.Image();
    pixel.src = `${this.#endpoint}?${query}`;
  }
}
