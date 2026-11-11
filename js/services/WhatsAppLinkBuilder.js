// Construye enlaces wa.me con un mensaje ya escrito.

export class WhatsAppLinkBuilder {
  #phone;

  constructor(phone) {
    this.#phone = String(phone).replace(/\D/g, '');
    if (this.#phone.length < 8) throw new Error('Número de WhatsApp inválido');
  }

  build(message = '') {
    const text = message ? `?text=${encodeURIComponent(message)}` : '';
    return `https://wa.me/${this.#phone}${text}`;
  }
}
