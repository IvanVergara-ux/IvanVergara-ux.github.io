// Datos personales y de contacto. Es el único archivo que hay que tocar para cambiarlos.

export const siteConfig = Object.freeze({
  person: Object.freeze({
    fullName: 'Iván Vergara Mercado',
    shortName: 'Iván Vergara',
    // Cuando tengas la foto: guárdala en assets/img/ y pon aquí la ruta, p. ej. 'assets/img/ivan.jpg'
    photo: null,
    initials: 'IV',
  }),
  brand: Object.freeze({
    logo: 'assets/logo.png',
  }),
  contact: Object.freeze({
    whatsapp: '+57 304 647 4670',
    email: 'ivandavidvergaram@gmail.com',
    github: 'https://github.com/IvanVergara-ux',
  }),
  // Idiomas en los que atiendes (se muestran en la cifra "Idiomas" de la portada)
  languages: Object.freeze([
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
  ]),
  fallbackLocale: 'es',
});
