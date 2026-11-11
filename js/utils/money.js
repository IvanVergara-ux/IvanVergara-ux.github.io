// Formatea precios en pesos colombianos según el idioma de la página.
//   es → "$700.000 COP"     en → "COP 700,000"

const NUMBER_LOCALES = Object.freeze({ es: 'es-CO', en: 'en-US' });

export function formatCop(value, locale) {
  if (locale === 'en') {
    return new Intl.NumberFormat(NUMBER_LOCALES.en, {
      style: 'currency',
      currency: 'COP',
      currencyDisplay: 'code',
      maximumFractionDigits: 0,
    }).format(value);
  }
  const amount = new Intl.NumberFormat(NUMBER_LOCALES.es, { maximumFractionDigits: 0 }).format(value);
  return `$${amount} COP`;
}
