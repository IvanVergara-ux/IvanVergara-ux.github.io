// Respeta la configuración del sistema "reducir movimiento".

export class MotionPreference {
  #query;

  constructor(win = window) {
    this.#query = win.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null;
  }

  get reduced() {
    return Boolean(this.#query?.matches);
  }
}
