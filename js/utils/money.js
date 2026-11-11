// Formatea precios en pesos colombianos según el idioma de la página.
//   es → "$ 700.000"     en → "COP 700,000"

const NUMBER_LOCALES = Object.freeze({ es: 'es-CO', en: 'en-US' });

export function formatCop(value, locale) {
  return new Intl.NumberFormat(NUMBER_LOCALES[locale] ?? 'es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: locale === 'es' ? 'symbol' : 'code',
    maximumFractionDigits: 0,
  }).format(value);
}
