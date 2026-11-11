// Publica el estado del desplazamiento en un elemento:
//   --scroll-progress (0 a 1) para la barra de lectura
//   .is-scrolled cuando la página ya no está arriba del todo

export class ScrollState {
  #target;
  #win;
  #frame = null;

  constructor({ target, win = window }) {
    this.#target = target;
    this.#win = win;
  }

  start() {
    const onScroll = () => {
      if (this.#frame) return;
      this.#frame = this.#win.requestAnimationFrame(() => {
        this.#frame = null;
        this.#update();
      });
    };
    this.#win.addEventListener('scroll', onScroll, { passive: true });
    this.#win.addEventListener('resize', onScroll, { passive: true });
    this.#update();
  }

  #update() {
    const doc = this.#win.document.documentElement;
    const max = doc.scrollHeight - this.#win.innerHeight;
    const progress = max > 0 ? Math.min(this.#win.scrollY / max, 1) : 0;
    this.#target.style.setProperty('--scroll-progress', progress.toFixed(4));
    this.#target.classList.toggle('is-scrolled', this.#win.scrollY > 8);
  }
}
