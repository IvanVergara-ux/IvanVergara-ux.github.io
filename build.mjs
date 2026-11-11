// Compila el sitio para publicarlo: genera la carpeta dist/ con
//   - index.html PRERENDERIZADO: la página completa ya escrita en el HTML (se ve al instante,
//     aunque el internet sea lento o el JavaScript no cargue; también ayuda a Google)
//   - un solo JavaScript minificado (todos los módulos unidos)
//   - un solo CSS minificado (todas las hojas en el orden de index.html)
//   - sitemap.xml y robots.txt para que Google encuentre e indexe la página
//   - sw.js: service worker que guarda la página en el dispositivo (visitas siguientes
//     instantáneas y funcionamiento sin conexión)
//   - la carpeta assets/ tal cual
// El código fuente (js/, css/) no se modifica: se sigue trabajando ahí con Live Server.
//
// Uso: npm install   (solo la primera vez)
//      npm run build

import { build, transform } from 'esbuild';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { createComponents, createI18n, firstHeroWord } from './js/app/createComponents.js';
import { siteConfig } from './js/config/site.config.js';

const OUT = 'dist';
const STYLESHEET = /^\s*<link rel="stylesheet" href="(css\/[^"]+)">\s*$/gm;

const hash = (content) => createHash('sha256').update(content).digest('hex').slice(0, 10);

async function bundleScripts() {
  const result = await build({
    entryPoints: ['js/main.js'],
    bundle: true,
    minify: true,
    format: 'esm',
    target: ['es2022'],
    legalComments: 'none',
    write: false,
  });
  const code = result.outputFiles[0].text;
  const name = `app.${hash(code)}.js`;
  await writeFile(`${OUT}/${name}`, code);
  return name;
}

async function bundleStyles(html) {
  const files = [...html.matchAll(STYLESHEET)].map((match) => match[1]);
  const sources = await Promise.all(files.map((file) => readFile(file, 'utf8')));
  const { code } = await transform(sources.join('\n'), { loader: 'css', minify: true, target: ['chrome100', 'safari15', 'firefox100'] });
  const name = `styles.${hash(code)}.css`;
  await writeFile(`${OUT}/${name}`, code);
  return name;
}

/** Escribe dentro de cada región de index.html el HTML que genera su componente (en español). */
function prerender(html) {
  const fakeRoot = (id) => ({
    id,
    ownerDocument: null,
    addEventListener() {},
    classList: { add() {}, remove() {}, toggle() {} },
    querySelector: () => null,
    querySelectorAll: () => [],
  });
  const roots = new Map();
  const region = (id) => {
    if (!roots.has(id)) roots.set(id, fakeRoot(id));
    return roots.get(id);
  };

  const i18n = createI18n();
  const browser = {
    createRotator: () => ({ start() {}, stop() {} }),
    countUp: { observe() {}, disconnect() {} },
    isOnline: () => true,
  };
  const { components } = createComponents({ region, i18n, browser });

  let output = html;
  for (const component of components) {
    const { id } = component.root;
    const markup = component
      .template()
      .toString()
      .trim()
      .replace(/data-rotator><\/span>/g, `data-rotator>${firstHeroWord(i18n.locale)}</span>`);
    const regionTag = new RegExp(`(<(\\w+) id="${id}"[^>]*>)(</\\2>)`);
    if (!regionTag.test(output)) throw new Error(`index.html no tiene la región #${id}`);
    // Una región sin contenido (por ejemplo, testimonios todavía vacíos) se publica oculta
    output = output.replace(regionTag, (_, open, _tag, close) =>
      markup ? `${open}${markup}${close}` : `${open.slice(0, -1)} hidden>${close}`);
  }
  return output.replace('<html lang="es">', '<html lang="es" data-prerendered>');
}

async function writeSeoFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteConfig.siteUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}sitemap.xml
`;
  await writeFile(`${OUT}/sitemap.xml`, sitemap);
  await writeFile(`${OUT}/robots.txt`, robots);
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => (entry.isDirectory() ? listFiles(join(dir, entry.name)) : [join(dir, entry.name)])),
  );
  return nested.flat();
}

async function writeServiceWorker() {
  const files = (await listFiles(OUT))
    .map((file) => relative(OUT, file).split(sep).join('/'))
    .filter((file) => !['sw.js', 'sitemap.xml', 'robots.txt'].includes(file) && !file.startsWith('.'));
  const contents = await Promise.all(files.map((file) => readFile(join(OUT, file))));
  const version = hash(Buffer.concat(contents));
  const template = await readFile('sw.template.js', 'utf8');
  const code = template
    .replaceAll('__VERSION__', version)
    .replaceAll('__PRECACHE__', JSON.stringify(['./', ...files.filter((file) => file !== 'index.html')]));
  const { code: minified } = await transform(code, { loader: 'js', minify: true });
  await writeFile(`${OUT}/sw.js`, minified);
  return version;
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const html = await readFile('index.html', 'utf8');
  const [script, styles] = await Promise.all([bundleScripts(), bundleStyles(html)]);

  let firstStylesheet = true;
  const output = prerender(html)
    .replace(STYLESHEET, () => {
      if (!firstStylesheet) return '';
      firstStylesheet = false;
      return `  <link rel="stylesheet" href="${styles}">`;
    })
    .replace('<script type="module" src="js/main.js"></script>', `<script type="module" src="${script}"></script>`)
    .replace(/<!--[\s\S]*?-->/g, '') // sin comentarios en la versión publicada
    .replace(/\n\s*\n+/g, '\n');

  await writeFile(`${OUT}/index.html`, output);
  await cp('assets', `${OUT}/assets`, { recursive: true });
  await writeFile(`${OUT}/.nojekyll`, '');
  await writeSeoFiles();
  const version = await writeServiceWorker();

  console.log(`Listo: ${OUT}/index.html (prerenderizado), ${script}, ${styles}, sw.js (versión ${version})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
