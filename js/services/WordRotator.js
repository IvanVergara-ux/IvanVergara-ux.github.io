// Cambia cíclicamente el texto de un elemento con una transición de salida y entrada
// (sin transición si el sistema pide reducir movimiento).

const LEAVE_MS = 320;

export class WordRotator {
  #element;
  #words;
  #interval;
  #motion;
  #index = 0;
  #timer = null;
  #swapTimer = null;

  constructor({ element, words, motion, interval = 2600 }) {
    this.#element = element;
    this.#words = words;
    this.#motion = motion;
    this.#interval = interval;
  }

  start() {
    this.stop();
    this.#element.textContent = this.#words[0] ?? '';
    if (this.#words.length < 2) return;
    // Con "reducir movimiento" activado las frases siguen cambiando, pero sin transición y más despacio
    const interval = this.#motion.reduced ? this.#interval * 1.5 : this.#interval;
    this.#timer = setInterval(() => this.#next(), interval);
  }

  stop() {
    clearInterval(this.#timer);
    clearTimeout(this.#swapTimer);
    this.#timer = null;
    this.#index = 0;
  }

  #next() {
    this.#index = (this.#index + 1) % this.#words.length;
    if (this.#motion.reduced) {
      this.#element.textContent = this.#words[this.#index];
      return;
    }
    this.#element.classList.add('is-leaving');
    this.#swapTimer = setTimeout(() => {
      this.#element.textContent = this.#words[this.#index];
      this.#element.classList.remove('is-leaving');
    }, LEAVE_MS);
  }
}
