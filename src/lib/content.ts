import siteFile from '/content/settings/site.yml';
import downloadsFile from '/content/settings/downloads.yml';
import type { Deployment, Downloads, GuidePage, Page, Resource, ResourceStatus, SiteSettings } from './types';

// Every file under /content is bundled at build time, so editing a file and
// pushing is all it takes to publish a change. The format is in
// content/README.md. The Vite plugin in vite.config.ts turns each file into
// data (Markdown rendered, YAML parsed), so the browser parses neither.
// English only for now: file names never contain a dot, so translations
// (home.fr.md) can sit beside them later, as in hda-website.
type Loaded = Record<string, unknown>;
const glob = (files: Record<string, Loaded>) =>
  Object.entries(files).map(([path, data]) => ({ ...data, slug: path.split('/').pop()!.replace(/\.md$/, '') }));

const pageFiles = import.meta.glob<Loaded>(['/content/pages/*.md', '!**/*.*.md'], { import: 'default', eager: true });
const deploymentFiles = import.meta.glob<Loaded>(['/content/deployments/*.md', '!**/*.*.md'], { import: 'default', eager: true });
const resourceFiles = import.meta.glob<Loaded>(['/content/resources/*.md', '!**/*.*.md'], { import: 'default', eager: true });
const guideFiles = import.meta.glob<Loaded>(['/content/guide/*.md', '!**/*.*.md'], { import: 'default', eager: true });

export const site = siteFile as unknown as SiteSettings;
export const downloads = downloadsFile as unknown as Downloads;

export const pages = glob(pageFiles).map((p) => ({ sections: [], ...p })) as unknown as Page[];
export const getPage = (slug: string) => pages.find((p) => p.slug === slug);

/** Most recent first; planned ones by start date too. */
export const deployments = (glob(deploymentFiles).map((d) => ({ ...d, id: d.slug })) as unknown as Deployment[]).sort((a, b) =>
  String(b.start).localeCompare(String(a.start)),
);
export const getDeployment = (id: string) => deployments.find((d) => d.id === id);

export const resources = (glob(resourceFiles).map((r) => ({ ...r, id: r.slug })) as unknown as Resource[]).sort(
  (a, b) => a.order - b.order,
);
export const getResource = (id: string) => resources.find((r) => r.id === id);

/** A resource's status, following another resource where it says so (the codebook follows the template). */
export function resourceStatus(r: Resource): ResourceStatus {
  const lead = r.follows ? getResource(r.follows) : undefined;
  return lead ? resourceStatus(lead) : r.status;
}

/** index.md is the guide's overview, at /guide. */
export const guide = (glob(guideFiles).map((g) => ({ ...g, slug: g.slug === 'index' ? '' : g.slug })) as unknown as GuidePage[]).sort(
  (a, b) => a.order - b.order,
);
export const guidePath = (g: GuidePage) => (g.slug ? `/guide/${g.slug}` : '/guide');
export const getGuidePage = (slug: string) => guide.find((g) => g.slug === slug);

/** Partners and endorsers by id. */
export const partnerName = (id: string) => [...site.partners, ...site.endorsers].find((p) => p.id === id)?.name ?? id;

/** `/` is `home.md`, `/method` is `method.md`, and so on. */
export function pageSlugFromPath(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, '') || 'home';
}

/** Every URL the prerenderer writes. */
export function allRoutes(): string[] {
  return [
    ...pages.map((p) => (p.slug === 'home' ? '/' : `/${p.slug}`)),
    ...deployments.map((d) => `/deployments/${d.id}`),
    ...guide.map(guidePath),
  ];
}

/** Title and description for a URL, used by the prerenderer and on navigation. */
export function metaForPath(pathname: string): { title: string; description: string } {
  const path = pathname.replace(/\/+$/, '') || '/';
  const suffix = ` · ${site.shortName}`;
  const deployment = /^\/deployments\/([^/]+)$/.exec(path);
  if (deployment) {
    const d = getDeployment(deployment[1]);
    if (d) return { title: `${d.title}${suffix}`, description: d.summary };
  }
  const guidePage = /^\/guide(?:\/([^/]+))?$/.exec(path);
  if (guidePage) {
    const g = getGuidePage(guidePage[1] ?? '');
    if (g) return { title: `${g.title}${suffix}`, description: g.summary };
  }
  const page = getPage(pageSlugFromPath(path));
  if (!page) return { title: `Page not found${suffix}`, description: site.description };
  return {
    title: page.slug === 'home' ? `${site.shortName}: ${site.name}` : `${page.title}${suffix}`,
    description: page.description ?? site.description,
  };
}
