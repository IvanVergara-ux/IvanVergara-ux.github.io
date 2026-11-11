// Plantillas HTML seguras: todo valor interpolado se escapa salvo que venga envuelto en SafeHtml.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ESCAPES[char]);

export const raw = (value) => new SafeHtml(String(value));

const toHtml = (value) => {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(toHtml).join('');
  if (value === false || value === null || value === undefined) return '';
  return escapeHtml(value);
};

export function html(strings, ...values) {
  const markup = strings.reduce(
    (acc, chunk, index) => acc + chunk + (index < values.length ? toHtml(values[index]) : ''),
    '',
  );
  return raw(markup);
}
