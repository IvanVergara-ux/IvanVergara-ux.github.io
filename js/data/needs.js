// Opciones del generador de mensajes de la sección de contacto.
// "phrase" es lo que se inserta en el mensaje de WhatsApp.

export const needs = Object.freeze([
  {
    id: 'web',
    label: { es: 'Página web', en: 'Website' },
    phrase: { es: 'una página web para mi negocio', en: 'a website for my business' },
  },
  {
    id: 'shop',
    label: { es: 'Tienda en línea', en: 'Online store' },
    phrase: { es: 'una tienda en línea', en: 'an online store' },
  },
  {
    id: 'app',
    label: { es: 'Aplicación móvil', en: 'Mobile app' },
    phrase: { es: 'una aplicación móvil', en: 'a mobile app' },
  },
  {
    id: 'system',
    label: { es: 'Software a la medida', en: 'Custom software' },
    phrase: {
      es: 'un software a la medida (inventario, citas o registros)',
      en: 'custom software (inventory, bookings or records)',
    },
  },
  {
    id: 'other',
    label: { es: 'Otro proyecto', en: 'Other project' },
    phrase: { es: 'desarrollar otro tipo de proyecto', en: 'another kind of project' },
  },
]);
