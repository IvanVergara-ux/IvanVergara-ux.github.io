// Compila el sitio para publicarlo: genera la carpeta dist/ con
//   - un solo JavaScript minificado (todos los módulos unidos)
//   - un solo CSS minificado (todas las hojas en el orden de index.html)
//   - index.html apuntando a esos dos archivos
//   - la carpeta assets/ tal cual
// El código fuente (js/, css/) no se modifica: se sigue trabajando ahí con Live Server.
//
// Uso: npm install   (solo la primera vez)
//      npm run build

import { build, transform } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

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

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const html = await readFile('index.html', 'utf8');
  const [script, styles] = await Promise.all([bundleScripts(), bundleStyles(html)]);

  let firstStylesheet = true;
  const output = html
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

  console.log(`Listo: ${OUT}/index.html, ${OUT}/${script}, ${OUT}/${styles}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
