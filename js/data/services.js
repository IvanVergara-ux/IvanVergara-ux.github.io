// "quote" se inserta en el mensaje de WhatsApp del botón "Cotizar".
// "icon" es un emblema de js/ui/emblems.js.
// "priceFrom" es el precio inicial en pesos colombianos (null = no se muestra).

export const services = Object.freeze([
  {
    id: 'web',
    icon: 'window',
    title: { es: 'Páginas web', en: 'Websites' },
    text: {
      es: 'Sitios web profesionales, rápidos y optimizados para Google, diseñados para convertir visitantes en clientes desde cualquier dispositivo.',
      en: 'Professional, fast, Google-optimized websites designed to turn visitors into customers on any device.',
    },
    fit: { es: 'Restaurantes, consultorios, profesionales y pymes', en: 'Restaurants, clinics, professionals and SMBs' },
    includes: [
      { es: 'Diseño adaptable a celulares y computadores', en: 'Responsive design for phones and desktops' },
      { es: 'Optimización para aparecer en Google', en: 'Optimized to rank on Google' },
      { es: 'Contacto directo por WhatsApp', en: 'Direct WhatsApp contact' },
    ],
    priceFrom: 700000,
    quote: { es: 'una página web', en: 'a website' },
  },
  {
    id: 'shop',
    icon: 'bag',
    title: { es: 'Tiendas en línea', en: 'Online stores' },
    text: {
      es: 'Catálogo de productos, carrito de compras y gestión de pedidos para que vendas las 24 horas sin depender de las redes sociales.',
      en: 'Product catalog, shopping cart and order management so you sell around the clock without relying on social media.',
    },
    fit: { es: 'Comercios de ropa, alimentos y artesanías', en: 'Clothing, food and craft retailers' },
    includes: [
      { es: 'Catálogo y carrito de compras', en: 'Catalog and shopping cart' },
      { es: 'Gestión de pedidos y notificaciones', en: 'Order management and notifications' },
      { es: 'Panel para administrar productos', en: 'Admin panel for your products' },
    ],
    priceFrom: 1800000,
    quote: { es: 'una tienda en línea', en: 'an online store' },
  },
  {
    id: 'apps',
    icon: 'phone',
    title: { es: 'Aplicaciones móviles', en: 'Mobile apps' },
    text: {
      es: 'Aplicaciones Android con Flutter o Android Studio, integradas con bases de datos y APIs para digitalizar la operación de tu negocio.',
      en: 'Android apps built with Flutter or Android Studio, integrated with databases and APIs to digitize your operations.',
    },
    fit: { es: 'Agendamiento de citas, pedidos y domicilios', en: 'Bookings, orders and deliveries' },
    includes: [
      { es: 'Interfaz diseñada a la medida', en: 'Custom-designed interface' },
      { es: 'Conexión con base de datos o API', en: 'Database or API integration' },
      { es: 'Instalador listo para usar', en: 'Ready-to-install build' },
    ],
    priceFrom: 3000000,
    quote: { es: 'una aplicación móvil', en: 'a mobile app' },
  },
  {
    id: 'systems',
    icon: 'stack',
    title: { es: 'Software a la medida', en: 'Custom software' },
    text: {
      es: 'Sistemas que centralizan y automatizan la información de tu empresa, con bases de datos MySQL o MongoDB y APIs en Node.js o Java.',
      en: 'Systems that centralize and automate your company’s data, with MySQL or MongoDB databases and APIs in Node.js or Java.',
    },
    fit: { es: 'Inventarios, gestión de clientes y reportes de ventas', en: 'Inventory, customer management and sales reports' },
    includes: [
      { es: 'Base de datos estructurada y segura', en: 'Structured, secure database' },
      { es: 'Reportes y consultas en tiempo real', en: 'Real-time reports and queries' },
      { es: 'API para integrarse con otras herramientas', en: 'API to connect with other tools' },
    ],
    priceFrom: 2500000,
    quote: { es: 'un software a la medida', en: 'custom software' },
  },
]);
