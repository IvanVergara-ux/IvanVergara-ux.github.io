// Anima números de 0 a su valor (data-count) cuando entran en pantalla.

const DURATION_MS = 1100;

export class CountUp {
  #motion;
  #observer = null;
  #frames = new Set();

  constructor({ motion }) {
    this.#motion = motion;
  }

  observe(elements) {
    this.disconnect();
    const items = [...elements];

    if (this.#motion.reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => this.#setFinal(el));
      return;
    }

    this.#observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        this.#observer.unobserve(entry.target);
        this.#animate(entry.target);
      });
    }, { threshold: 0.25 });

    items.forEach((el) => {
      el.textContent = '0';
      this.#observer.observe(el);
    });
  }

  disconnect() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#frames.forEach((id) => cancelAnimationFrame(id));
    this.#frames.clear();
  }

  #setFinal(el) {
    el.textContent = el.dataset.count;
  }

  #animate(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) this.#frames.add(requestAnimationFrame(step));
    };
    this.#frames.add(requestAnimationFrame(step));
  }
}
