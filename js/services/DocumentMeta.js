// Mantiene <html lang>, el título y la descripción del documento en el idioma activo.

export class DocumentMeta {
  constructor({ i18n, doc = document }) {
    this.i18n = i18n;
    this.doc = doc;
  }

  update() {
    const { doc, i18n } = this;
    doc.documentElement.lang = i18n.locale;
    doc.title = i18n.t('meta.title');
    this.#setMeta('meta[name="description"]', i18n.t('meta.description'));
    this.#setMeta('meta[property="og:title"]', i18n.t('meta.title'));
    this.#setMeta('meta[property="og:description"]', i18n.t('meta.description'));
  }

  #setMeta(selector, content) {
    this.doc.querySelector(selector)?.setAttribute('content', content);
  }
}
