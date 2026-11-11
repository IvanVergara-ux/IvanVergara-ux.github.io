// Cuenta los clics importantes sin tocar los componentes: escucha toda la página y
// clasifica el enlace por su destino y por la sección donde está.
//   WhatsApp en la portada → "whatsapp/inicio"
//   Correo en contacto     → "correo/contacto"
// Para medir un enlace nuevo de estos tipos no hay que cambiar nada.

const RULES = Object.freeze([
  { name: 'whatsapp', test: (href) => href.startsWith('https://wa.me/') },
  { name: 'correo', test: (href) => href.startsWith('mailto:') },
  { name: 'github', test: (href) => href.startsWith('https://github.com/') },
]);

export class ClickTracker {
  #analytics;
  #doc;

  constructor({ analytics, doc = document }) {
    this.#analytics = analytics;
    this.#doc = doc;
  }

  start() {
    if (!this.#analytics.enabled) return;
    this.#doc.addEventListener('click', (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      const rule = RULES.find(({ test }) => test(link.href));
      if (!rule) return;
      const area = link.closest('section[id], header[id], footer[id], div[id]')?.id ?? 'pagina';
      this.#analytics.event(`${rule.name}/${area}`);
    });
  }
}
