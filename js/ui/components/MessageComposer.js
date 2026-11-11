import { html } from '../../utils/html.js';

// El visitante elige qué necesita y obtiene un mensaje de WhatsApp listo para enviar.
// Al cambiar la opción solo se actualizan la burbuja y el enlace: no se repinta todo
// (así no se pierde el foco del teclado).

export class MessageComposer {
  #i18n;
  #needs;
  #whatsApp;
  #selectedId;
  #refs = {};

  constructor({ i18n, needs, whatsApp }) {
    if (!needs.length) throw new Error('MessageComposer necesita al menos una opción');
    this.#i18n = i18n;
    this.#needs = needs;
    this.#whatsApp = whatsApp;
    this.#selectedId = needs[0].id;
  }

  template() {
    const t = (key) => this.#i18n.t(key);
    const message = this.#currentMessage();
    return html`
      <div class="composer">
        <fieldset class="composer__options">
          <legend class="composer__legend">${t('composer.legend')}</legend>
          ${this.#needs.map(
            (need) => html`
              <label class="chip">
                <input type="radio" name="need" value="${need.id}" ${need.id === this.#selectedId ? 'checked' : ''}>
                <span>${this.#i18n.pick(need.label)}</span>
              </label>
            `,
          )}
        </fieldset>
        <figure class="composer__preview">
          <figcaption class="visually-hidden">${t('composer.previewLabel')}</figcaption>
          <p class="bubble" data-ref="bubble" aria-live="polite">${message}</p>
        </figure>
        <a class="button button--primary composer__send" data-ref="send" href="${this.#whatsApp.build(message)}" target="_blank" rel="noopener noreferrer">
          ${t('composer.send')}
        </a>
        <p class="composer__hint">${t('composer.hint')}</p>
      </div>
    `;
  }

  attach(container) {
    this.#refs = {
      bubble: container.querySelector('[data-ref="bubble"]'),
      send: container.querySelector('[data-ref="send"]'),
    };
    this.#update();
  }

  handleChange(event) {
    if (event.target.name !== 'need') return;
    this.#selectedId = event.target.value;
    this.#update();
  }

  #currentMessage() {
    const need = this.#needs.find((item) => item.id === this.#selectedId) ?? this.#needs[0];
    return this.#i18n.t('composer.message', { need: this.#i18n.pick(need.phrase) });
  }

  #update() {
    const message = this.#currentMessage();
    if (this.#refs.bubble) this.#refs.bubble.textContent = message;
    if (this.#refs.send) this.#refs.send.href = this.#whatsApp.build(message);
  }
}
