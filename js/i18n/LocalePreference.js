// Recuerda el idioma elegido por el visitante. El almacenamiento se inyecta,
// así se puede cambiar (o simular en pruebas) sin tocar esta clase.

const memoryStorage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
};

const browserStorage = () => {
  try {
    const probe = '__probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return memoryStorage();
  }
};

export class LocalePreference {
  #storage;
  #key;

  constructor({ storage = browserStorage(), key = 'portfolio.locale' } = {}) {
    this.#storage = storage;
    this.#key = key;
  }

  load() {
    try {
      return this.#storage.getItem(this.#key);
    } catch {
      return null;
    }
  }

  save(locale) {
    try {
      this.#storage.setItem(this.#key, locale);
    } catch {
      // Sin almacenamiento disponible: el idioma solo dura esta visita.
    }
  }
}

/** Orden de prioridad: lo que el visitante eligió antes, el idioma del navegador y por último el de respaldo. */
export function detectInitialLocale({ i18n, preference, browserLanguages = navigator.languages ?? [], fallback }) {
  const saved = preference.load();
  if (saved && i18n.supports(saved)) return saved;

  const fromBrowser = browserLanguages
    .map((tag) => tag.slice(0, 2).toLowerCase())
    .find((code) => i18n.supports(code));

  return fromBrowser ?? fallback;
}
