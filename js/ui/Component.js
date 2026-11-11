// Contrato común de la UI: cada componente pinta su propia región del DOM.
// Las subclases implementan template() y, si lo necesitan, bindEvents(), afterRender() y beforeRender().

export class Component {
  constructor({ root, i18n }) {
    if (!root) throw new Error(`${this.constructor.name}: falta el elemento raíz`);
    if (!i18n) throw new Error(`${this.constructor.name}: falta el servicio de idioma`);
    this.root = root;
    this.i18n = i18n;
    this.bindEvents();
  }

  /** Atajo para traducir dentro de las plantillas. */
  t(key, params) {
    return this.i18n.t(key, params);
  }

  /** Atajo para elegir el texto del idioma activo en un objeto { es, en }. */
  pick(localized) {
    return this.i18n.pick(localized);
  }

  /** Devuelve el HTML del componente. Obligatorio en cada subclase. */
  template() {
    throw new Error(`${this.constructor.name} debe implementar template()`);
  }

  render() {
    this.beforeRender();
    this.root.innerHTML = this.template().toString();
    this.afterRender();
  }

  /** Se registran una sola vez sobre la raíz (delegación), así sobreviven a cada render. */
  bindEvents() {}

  /** Para liberar temporizadores u observadores antes de repintar. */
  beforeRender() {}

  afterRender() {}
}
