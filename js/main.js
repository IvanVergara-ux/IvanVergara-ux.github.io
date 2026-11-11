// Punto de composición: aquí, y solo aquí, se crean las dependencias y se conectan entre sí.
// Los componentes las reciben por constructor y nunca importan servicios globales.

import { siteConfig } from './config/site.config.js';
import { navigation } from './config/navigation.js';
import { projects } from './data/projects.js';
import { services } from './data/services.js';
import { processSteps } from './data/process.js';
import { commitments } from './data/commitments.js';
import { faq } from './data/faq.js';
import { needs } from './data/needs.js';
import { heroWords, trustPoints } from './data/hero.js';
import { technologyLogos, studiedTechnologies } from './data/technologies.js';
import es from './i18n/locales/es.js';
import en from './i18n/locales/en.js';
import { I18n } from './i18n/I18n.js';
import { LocalePreference, detectInitialLocale } from './i18n/LocalePreference.js';
import { WhatsAppLinkBuilder } from './services/WhatsAppLinkBuilder.js';
import { DocumentMeta } from './services/DocumentMeta.js';
import { MotionPreference } from './services/MotionPreference.js';
import { WordRotator } from './services/WordRotator.js';
import { CountUp } from './services/CountUp.js';
import { buildPortfolioStats } from './services/PortfolioStats.js';
import { ScrollState } from './services/ScrollState.js';
import { SectionSpy } from './services/SectionSpy.js';
import { Header } from './ui/components/Header.js';
import { Hero } from './ui/components/Hero.js';
import { Services } from './ui/components/Services.js';
import { Commitments } from './ui/components/Commitments.js';
import { Projects } from './ui/components/Projects.js';
import { ProjectCard } from './ui/components/ProjectCard.js';
import { Process } from './ui/components/Process.js';
import { Faq } from './ui/components/Faq.js';
import { Contact } from './ui/components/Contact.js';
import { MessageComposer } from './ui/components/MessageComposer.js';
import { Footer } from './ui/components/Footer.js';
import { FloatingContact } from './ui/components/FloatingContact.js';

const region = (selector) => document.querySelector(selector);

function bootstrap() {
  const { person, brand, contact, languages, fallbackLocale } = siteConfig;

  const i18n = new I18n({ dictionaries: { es, en }, fallback: fallbackLocale });
  const preference = new LocalePreference();
  i18n.setLocale(detectInitialLocale({ i18n, preference, fallback: fallbackLocale }));

  const whatsApp = new WhatsAppLinkBuilder(contact.whatsapp);
  const motion = new MotionPreference();
  const meta = new DocumentMeta({ i18n });
  const stats = buildPortfolioStats({ projects, technologyLogos, studiedTechnologies, languages });
  const createRotator = ({ element, words }) => new WordRotator({ element, words, motion });

  const header = new Header({ root: region('#site-header'), i18n, person, brand, navigation, languages });

  const components = [
    header,
    new Hero({
      root: region('#inicio'), i18n, person, logo: brand.logo, words: heroWords, trustPoints, stats, whatsApp,
      createRotator, countUp: new CountUp({ motion }),
    }),
    new Services({ root: region('#servicios'), i18n, services, whatsApp }),
    new Projects({ root: region('#proyectos'), i18n, projects, card: new ProjectCard({ i18n }) }),
    new Commitments({ root: region('#compromisos'), i18n, items: commitments }),
    new Process({ root: region('#proceso'), i18n, steps: processSteps }),
    new Faq({ root: region('#preguntas'), i18n, items: faq }),
    new Contact({
      root: region('#contacto'), i18n, contact, whatsApp,
      composer: new MessageComposer({ i18n, needs, whatsApp }),
    }),
    new Footer({ root: region('#site-footer'), i18n, person, brand, contact, navigation, whatsApp }),
    new FloatingContact({ root: region('#floating-contact'), i18n, whatsApp, watch: [region('#inicio'), region('#contacto')] }),
  ];

  const renderAll = () => {
    meta.update();
    components.forEach((component) => component.render());
  };

  i18n.subscribe((locale) => preference.save(locale));
  i18n.subscribe(renderAll);

  renderAll();

  const spy = new SectionSpy({ ids: navigation.map((item) => item.href.slice(1)) });
  spy.onChange((id) => header.setActiveSection(id));
  spy.start();
  new ScrollState({ target: region('#site-header') }).start();

  document.documentElement.classList.add('is-ready');
}

bootstrap();
