// Fábrica única de los componentes de la página.
// La usan el navegador (js/main.js) y la compilación (build.mjs, para prerenderizar el HTML),
// así las dos versiones salen siempre del mismo código.
//
// Lo que depende del navegador (animaciones, contadores, observadores) llega desde afuera:
// en la compilación se pasan versiones vacías.

import { siteConfig } from '../config/site.config.js';
import { navigation } from '../config/navigation.js';
import { projects } from '../data/projects.js';
import { services } from '../data/services.js';
import { processSteps } from '../data/process.js';
import { commitments } from '../data/commitments.js';
import { faq } from '../data/faq.js';
import { testimonials } from '../data/testimonials.js';
import { needs } from '../data/needs.js';
import { heroWords, trustPoints } from '../data/hero.js';
import { technologyLogos, studiedTechnologies } from '../data/technologies.js';
import es from '../i18n/locales/es.js';
import en from '../i18n/locales/en.js';
import { I18n } from '../i18n/I18n.js';
import { WhatsAppLinkBuilder } from '../services/WhatsAppLinkBuilder.js';
import { buildPortfolioStats } from '../services/PortfolioStats.js';
import { CurrencyState } from '../pricing/CurrencyState.js';
import { Header } from '../ui/components/Header.js';
import { Hero } from '../ui/components/Hero.js';
import { Services } from '../ui/components/Services.js';
import { Commitments } from '../ui/components/Commitments.js';
import { Projects } from '../ui/components/Projects.js';
import { ProjectCard } from '../ui/components/ProjectCard.js';
import { Process } from '../ui/components/Process.js';
import { Faq } from '../ui/components/Faq.js';
import { Contact } from '../ui/components/Contact.js';
import { MessageComposer } from '../ui/components/MessageComposer.js';
import { Footer } from '../ui/components/Footer.js';
import { FloatingContact } from '../ui/components/FloatingContact.js';
import { OfflineNotice } from '../ui/components/OfflineNotice.js';
import { Testimonials } from '../ui/components/Testimonials.js';

export function createI18n() {
  return new I18n({ dictionaries: { es, en }, fallback: siteConfig.fallbackLocale });
}

/**
 * @param region      función que devuelve el elemento raíz de una región por su id
 * @param i18n        servicio de idioma
 * @param browser     { createRotator, countUp, isOnline } — dependencias del navegador
 * @param currency    estado de la moneda de los precios (si no llega, solo se muestran en COP)
 */
export function createComponents({ region, i18n, browser, currency = createCurrencyState() }) {
  const { person, brand, contact, languages } = siteConfig;
  const whatsApp = new WhatsAppLinkBuilder(contact.whatsapp);
  const stats = buildPortfolioStats({ projects, technologyLogos, studiedTechnologies, languages });

  const header = new Header({ root: region('site-header'), i18n, person, brand, navigation, languages });

  const components = [
    header,
    new Hero({
      root: region('inicio'), i18n, person, logo: brand.logo, words: heroWords, trustPoints, stats, whatsApp,
      createRotator: browser.createRotator, countUp: browser.countUp,
    }),
    new Services({ root: region('servicios'), i18n, services, whatsApp, currency }),
    new Projects({ root: region('proyectos'), i18n, projects, card: new ProjectCard({ i18n }) }),
    new Testimonials({ root: region('testimonios'), i18n, items: testimonials }),
    new Commitments({ root: region('compromisos'), i18n, items: commitments }),
    new Process({ root: region('proceso'), i18n, steps: processSteps }),
    new Faq({ root: region('preguntas'), i18n, items: faq }),
    new Contact({
      root: region('contacto'), i18n, contact, whatsApp,
      composer: new MessageComposer({ i18n, needs, whatsApp }),
    }),
    new Footer({ root: region('site-footer'), i18n, person, brand, contact, navigation, whatsApp }),
    new FloatingContact({ root: region('floating-contact'), i18n, whatsApp, watch: [region('inicio'), region('contacto')] }),
    new OfflineNotice({ root: region('offline-notice'), i18n, isOnline: browser.isOnline }),
  ];

  return { header, components, navigation };
}

/** Estado de la moneda con la configuración del sitio. */
export function createCurrencyState({ chosen = null } = {}) {
  const { base, currencies, defaults } = siteConfig.pricing;
  return new CurrencyState({ base, currencies, defaults, chosen });
}

/** Primera frase de la portada, para el HTML prerenderizado. */
export const firstHeroWord = (locale) => heroWords[locale]?.[0] ?? '';
