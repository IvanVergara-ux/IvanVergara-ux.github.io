// Registra el service worker (sw.js) que guarda la página en el dispositivo del visitante:
// las visitas siguientes abren al instante y la página funciona sin internet.
// Solo en el sitio publicado (https); en Live Server no se registra para no guardar versiones viejas.

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export class ServiceWorkerRegistrar {
  #win;

  constructor({ win = window, scriptUrl = 'sw.js' } = {}) {
    this.#win = win;
    this.scriptUrl = scriptUrl;
  }

  get supported() {
    const { location, navigator } = this.#win;
    return 'serviceWorker' in navigator && location.protocol === 'https:' && !LOCAL_HOSTS.has(location.hostname);
  }

  register() {
    if (!this.supported) return;
    this.#win.addEventListener('load', () => {
      this.#win.navigator.serviceWorker.register(this.scriptUrl).catch(() => {
        // Si falla, la página funciona igual: solo no queda guardada para uso sin conexión.
      });
    });
  }
}
