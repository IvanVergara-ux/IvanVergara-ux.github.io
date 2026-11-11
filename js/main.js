// Punto de composición en el navegador: crea los servicios que dependen del navegador
// y se los pasa a la fábrica de componentes (la misma que usa la compilación).

import { siteConfig } from './config/site.config.js';
import { createComponents, createI18n } from './app/createComponents.js';
import { LocalePreference, detectInitialLocale } from './i18n/LocalePreference.js';
import { DocumentMeta } from './services/DocumentMeta.js';
import { MotionPreference } from './services/MotionPreference.js';
import { WordRotator } from './services/WordRotator.js';
import { CountUp } from './services/CountUp.js';
import { ScrollState } from './services/ScrollState.js';
import { SectionSpy } from './services/SectionSpy.js';
import { ServiceWorkerRegistrar } from './services/ServiceWorkerRegistrar.js';
import { Analytics } from './services/Analytics.js';
import { ClickTracker } from './services/ClickTracker.js';

const region = (id) => document.getElementById(id);

function bootstrap() {
  const i18n = createI18n();
  const preference = new LocalePreference();
  i18n.setLocale(detectInitialLocale({ i18n, preference, fallback: siteConfig.fallbackLocale }));

  const motion = new MotionPreference();
  const browser = {
    createRotator: ({ element, words }) => new WordRotator({ element, words, motion }),
    countUp: new CountUp({ motion }),
    isOnline: () => navigator.onLine,
  };

  const { header, components, navigation } = createComponents({ region, i18n, browser });
  const meta = new DocumentMeta({ i18n });

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
  new ScrollState({ target: region('site-header') }).start();
  new ServiceWorkerRegistrar().register();

  const analytics = new Analytics({ code: siteConfig.analytics.goatcounter });
  analytics.pageview();
  new ClickTracker({ analytics }).start();

  // Si la página ya venía prerenderizada, el visitante ya la está viendo: no se repite la animación de entrada.
  if (!document.documentElement.hasAttribute('data-prerendered')) {
    document.documentElement.classList.add('is-ready');
  }
}

bootstrap();
