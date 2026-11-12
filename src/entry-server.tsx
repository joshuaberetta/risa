import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { allRoutes, downloads, metaForPath } from './lib/content';
import { legacyRedirect } from './lib/url';

export { allRoutes, metaForPath, legacyRedirect };
/** Where the old /downloads/ links now point, for the 404 page's redirect. */
export const legacyFiles = { template: downloads.files.template.path, codebook: downloads.files.codebook.path };

/** Used by scripts/prerender.mjs to write one HTML file per route. */
export function render(route: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={`${base}${route}`} basename={base || '/'}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: metaForPath(route) };
}
