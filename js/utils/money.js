// Formatea precios con el código de la moneda siempre visible, según el idioma de la página.
//   es → "$700.000 COP", "$215 USD", "€185 EUR"
//   en → "COP 700,000", "USD 215", "EUR 185"

const NUMBER_LOCALES = Object.freeze({ es: 'es-CO', en: 'en-US' });

export function formatPrice(value, currency, locale) {
  if (locale === 'en') {
    return new Intl.NumberFormat(NUMBER_LOCALES.en, {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
      maximumFractionDigits: 0,
    }).format(value).replace(/ /g, ' ');
  }
  const symbol = new Intl.NumberFormat(NUMBER_LOCALES.es, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).formatToParts(0).find((part) => part.type === 'currency')?.value ?? '';
  const amount = new Intl.NumberFormat(NUMBER_LOCALES.es, { maximumFractionDigits: 0 }).format(value);
  return `${symbol}${amount} ${currency}`;
}

/** Compatibilidad: precio en pesos colombianos. */
export const formatCop = (value, locale) => formatPrice(value, 'COP', locale);
