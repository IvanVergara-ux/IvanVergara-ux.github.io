// Cifras de la portada calculadas a partir de los datos reales: nunca escritas a mano.
// Cada cifra trae también su detalle (lo que se ve al pasar el cursor).

export function buildPortfolioStats({ projects, technologyLogos, studiedTechnologies = [], languages }) {
  const stack = [...new Set([...projects.flatMap((project) => project.stack), ...studiedTechnologies])];

  return Object.freeze([
    {
      id: 'projects',
      value: projects.length,
      labelKey: 'hero.stats.projects',
      titleKey: 'hero.stats.projectsTitle',
      layout: 'list',
      items: projects.map((project) => ({
        label: project.title,
        detail: project.kind,
        emblem: project.emblem,
        tone: project.tone,
      })),
    },
    {
      id: 'technologies',
      value: stack.length,
      labelKey: 'hero.stats.technologies',
      titleKey: 'hero.stats.technologiesTitle',
      layout: 'grid',
      items: stack
        .map((name) => ({ label: name, logo: technologyLogos[name] ?? null }))
        .sort((a, b) => Number(Boolean(b.logo)) - Number(Boolean(a.logo))), // primero las que tienen logo
    },
    {
      id: 'languages',
      value: languages.length,
      labelKey: 'hero.stats.languages',
      titleKey: 'hero.stats.languagesTitle',
      layout: 'list',
      items: languages.map((language) => ({ label: language.name, flag: language.code })),
    },
  ]);
}
