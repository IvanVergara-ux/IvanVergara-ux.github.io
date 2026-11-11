// Para agregar un proyecto basta con añadir un objeto a esta lista: ningún componente cambia.
//
// Campos:
//   id        identificador único
//   title     nombre del proyecto (texto, o { es, en } si cambia según el idioma)
//   kind      tipo de proyecto { es, en }
//   category  filtro al que pertenece: 'web' | 'mobile' | 'systems' (etiquetas en projects.filters)
//   tags      claves de projects.tags en los archivos de idioma
//   summary   qué es y qué problema resuelve { es, en }
//   role      tu aporte { es, en }
//   stack     tecnologías (texto igual en ambos idiomas)
//   emblem    emblema de js/ui/emblems.js y tone su color: 'mint' | 'amber' | 'sky' | 'ink'
//   device    marco de la vista previa sin captura: 'phone' | 'browser' | 'terminal'
//   image     imagen de la tarjeta, 1200 × 750 px (null = se muestra el marco con el nombre)
//   links     { repo, demo } (null = no se muestra el botón)

export const projects = Object.freeze([
  {
    id: 'ruta-segura-bolivar',
    title: 'Ruta Segura Bolívar',
    kind: { es: 'Aplicación móvil', en: 'Mobile app' },
    category: 'mobile',
    tags: ['academic', 'solo'],
    summary: {
      es: 'Aplicación móvil que calcula rutas seguras y eficientes entre dos puntos de San Juan Nepomuceno, Bolívar.',
      en: 'Mobile app that calculates safe, efficient routes between two points in San Juan Nepomuceno, Colombia.',
    },
    role: {
      es: 'Desarrollo integral de la aplicación, desde el diseño de la interfaz hasta la implementación de la lógica de rutas.',
      en: 'End-to-end development of the app, from interface design to the implementation of the routing logic.',
    },
    stack: ['Flutter', 'Dart', 'Android Studio'],
    emblem: 'route',
    tone: 'mint',
    device: 'phone',
    image: 'assets/projects/ruta-segura-bolivar.webp',
    links: { repo: null, demo: null },
  },
  {
    id: 'api-barberia',
    title: { es: 'API de citas para barbería', en: 'Barbershop booking API' },
    kind: { es: 'API y aplicación móvil', en: 'API and mobile app' },
    category: 'mobile',
    tags: ['academic', 'solo'],
    summary: {
      es: 'API REST para la gestión de citas de una barbería, con creación, consulta, actualización y cancelación desde una aplicación móvil.',
      en: 'REST API to manage a barbershop’s appointments, with booking, lookup, updates and cancellation from a mobile app.',
    },
    role: {
      es: 'Desarrollo de la API con Node.js y Express e integración con la aplicación móvil en Flutter.',
      en: 'Built the API with Node.js and Express and integrated it with the Flutter mobile app.',
    },
    stack: ['Node.js', 'Express', 'Flutter', 'REST'],
    emblem: 'scissors',
    tone: 'amber',
    device: 'phone',
    image: 'assets/projects/api-barberia.webp',
    links: { repo: null, demo: null },
  },
  {
    id: 'inventario-app',
    title: 'InventarioApp',
    kind: { es: 'Aplicación móvil', en: 'Mobile app' },
    category: 'mobile',
    tags: ['academic', 'team'],
    summary: {
      es: 'Aplicación para el control de inventario de productos, con registro validado, consulta, alertas y exportación de datos.',
      en: 'Product inventory app with validated entry, search, alerts and data export.',
    },
    role: {
      es: 'Formularios con validación, persistencia local con Room, menús y notificaciones; posterior migración a Flutter con autenticación de usuarios.',
      en: 'Validated forms, local persistence with Room, menus and notifications; later migrated to Flutter with user authentication.',
    },
    stack: ['Android', 'Room', 'SQLite', 'Flutter'],
    emblem: 'box',
    tone: 'sky',
    device: 'phone',
    image: 'assets/projects/inventario-app.webp',
    links: { repo: null, demo: null },
  },
  {
    id: 'portafolio',
    title: { es: 'Portafolio profesional', en: 'Professional portfolio' },
    kind: { es: 'Sitio web', en: 'Website' },
    category: 'web',
    tags: ['personal', 'solo'],
    summary: {
      es: 'Sitio bilingüe de alto rendimiento con generador de mensajes para WhatsApp orientado a captar clientes.',
      en: 'High-performance bilingual site with a WhatsApp message builder designed to win clients.',
    },
    role: {
      es: 'Diseño y desarrollo desde cero, sin librerías externas, con una arquitectura modular basada en principios SOLID.',
      en: 'Designed and built from scratch, with no external libraries, on a modular architecture based on SOLID principles.',
    },
    stack: ['HTML', 'CSS', 'JavaScript'],
    emblem: 'window',
    tone: 'ink',
    device: 'browser',
    image: 'assets/projects/portafolio.webp',
    links: { repo: null, demo: null },
  },
]);
