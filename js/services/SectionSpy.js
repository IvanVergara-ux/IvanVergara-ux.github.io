// Detecta qué sección está en pantalla y avisa a quien se suscriba (por ejemplo, el menú).

export class SectionSpy {
  #ids;
  #listeners = new Set();
  #observer = null;
  #visible = new Map();

  constructor({ ids }) {
    this.#ids = ids;
  }

  onChange(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  start() {
    if (!('IntersectionObserver' in window)) return;
    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => this.#visible.set(entry.target.id, entry.isIntersecting));
      const active = this.#ids.find((id) => this.#visible.get(id)) ?? null;
      this.#listeners.forEach((listener) => listener(active));
    }, { rootMargin: '-45% 0px -50% 0px' });

    this.#ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((section) => this.#observer.observe(section));
  }
}
