const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix site-relative asset paths (/images/…, /files/…) with the deploy base path. */
export function asset(path?: string): string | undefined {
  if (!path) return path;
  return path.startsWith('/') ? `${BASE}${path}` : path;
}

/** `/method/` -> `/method`, so links match whether or not the host adds a trailing slash. */
export const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

/** Files (/files/), images and the review site (/designs/) are plain <a> tags, not client-side routes. */
export function isRouterLink(href: string): boolean {
  return href.startsWith('/') && !/^\/(files|designs|images)(\/|$)/.test(href);
}

/**
 * Where an old link should go now, or null. Reviewers pasted review-site links
 * (/themes/handbook/index.html?logo=…) into the voting doc; those go to the
 * same page under /designs/. The first template download goes to the current
 * one. scripts/prerender.mjs inlines a copy of this into 404.html, and
 * NotFound (src/pages/pages.tsx) runs it on the dev server.
 */
export function legacyRedirect(pathname: string, search: string, hash: string, files: { template: string; codebook: string }): string | null {
  if (pathname === '/downloads/RISA_template.xlsx') return files.template;
  if (pathname === '/downloads/RISA_codebook.md') return files.codebook;
  if (/^\/(themes|logos|palettes|results|assets|downloads)\//.test(pathname)) return `/designs${pathname}${search}${hash}`;
  // deployment.html?d=<id> at the site root, as the review site linked it.
  const d = /^\/deployment\.html$/.test(pathname) && new URLSearchParams(search).get('d');
  if (d && /^[a-z0-9-]+$/.test(d)) return `/deployments/${d}`;
  return null;
}
