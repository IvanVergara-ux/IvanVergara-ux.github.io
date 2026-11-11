import { html } from '../../utils/html.js';
import { icons } from '../icons.js';

// Ventana de editor decorativa de la portada. Función pura: recibe una función de traducción.
// El valor de "solucion" lo rellena un WordRotator a través de [data-rotator].

export function codeWindow(t) {
  const key = (name) => html`<span class="tok-key">${name}</span>`;
  const str = (value) => html`<span class="tok-str">"${value}"</span>`;

  return html`
    <figure class="code-window" aria-hidden="true">
      <div class="code-window__bar">
        <span class="code-window__dots"><i></i><i></i><i></i></span>
        <span class="code-window__file">${t('hero.code.file')}</span>
      </div>
      <pre class="code-window__body"><code><span class="tok-comment">${t('hero.code.comment')}</span>
<span class="tok-kw">const</span> proyecto = {
  ${key(t('hero.code.client'))}: ${str(t('hero.code.clientValue'))},
  ${key(t('hero.code.solution'))}: <span class="tok-str">"<span class="code-window__rotating" data-rotator></span>"</span>,
  ${key(t('hero.code.delivery'))}: ${str(t('hero.code.deliveryValue'))},
  ${key(t('hero.code.status'))}: ${str(t('hero.code.statusValue'))},
};<span class="code-window__caret"></span></code></pre>
      <figcaption class="code-window__status">${icons.check(16)} ${t('hero.code.footer')}</figcaption>
    </figure>
  `;
}
