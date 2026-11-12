// The shape of everything in /content. The format is in content/README.md.
// Changing it means updating the section component, SectionRenderer.tsx,
// scripts/validate-content.mjs and content/README.md together.

import type { Status } from './status';

/** Markdown, rendered at build time by scripts/markdown.mjs. */
export type Block =
  | { type: 'html'; html: string }
  | { type: 'callout'; tone: 'failure' | 'tip' | 'kobo-mcp' | 'note'; title?: string; blocks: Block[] }
  | { type: 'tabs'; tabs: { label: string; badge?: string; blocks: Block[] }[] }
  | { type: 'prompt'; text: string; tool?: string }
  | { type: 'component'; name: 'download-card' | 'codebook' | 'status-scale' | 'guide-pages' };
export type Body = Block[];

export interface TocEntry {
  id: string;
  text: string;
}

export interface LinkItem {
  label: string;
  href: string;
  /** `primary` is the blue button, `secondary` the outlined one, `link` (default) a plain link. */
  variant?: 'primary' | 'secondary' | 'link';
}

export interface Partner {
  id: string;
  name: string;
  role?: string;
  note?: string;
  tbc?: boolean;
}

export interface SiteSettings {
  name: string;
  nameStatus: 'pending' | 'agreed';
  shortName: string;
  description: string;
  contact: string;
  contactTbc?: boolean;
  dashboardUrl: string;
  partners: Partner[];
  endorsers: Partner[];
  nav: LinkItem[];
  cta: LinkItem;
  footer: { owners: string; note?: string; links: LinkItem[] };
}

/** What scripts/sync-downloads.sh copied into public/files/. */
export interface Downloads {
  version: string;
  synced: string;
  files: Record<'template' | 'codebook' | 'legacyCodes', { path: string; bytes: number }>;
}

// ---------------------------------------------------------------------------
// Sections. Every section can have an id (its anchor, and its entry in the
// page's contents list when it has a title), a title, `hidden` and `tbc`.
// ---------------------------------------------------------------------------

interface SectionBase {
  id?: string;
  title?: string;
  /** Shown in the contents list instead of the title. */
  short?: string;
  intro?: string;
  hidden?: boolean;
  tbc?: boolean;
}

export interface HeroSection extends SectionBase {
  type: 'hero';
  kicker?: string;
  /** Use the site name (site.yml) as the title, with its sign-off note. */
  siteName?: boolean;
  lead?: string;
  questions?: string[];
  links?: LinkItem[];
}

export interface ProseSection extends SectionBase {
  type: 'prose';
  body: Body;
}

export interface AudiencesSection extends SectionBase {
  type: 'audiences';
  items: { who: string; examples: string; question: string; gets: string[]; link?: LinkItem; lead?: boolean }[];
}

/** Term and description rows (Handbook's `dl`): the three inputs, roles. */
export interface RowsSection extends SectionBase {
  type: 'rows';
  items: { term: string; detail?: string; body: Body; tbc?: boolean }[];
  body?: Body;
}

export interface StepsSection extends SectionBase {
  type: 'steps';
  items: { title: string; body?: Body; failure?: string }[];
  body?: Body;
}

export interface TableSection extends SectionBase {
  type: 'table';
  columns: string[];
  rows: string[][];
  caption?: string;
  body?: Body;
}

export interface TimelineSection extends SectionBase {
  type: 'timeline';
  items: { when: string; title: string; body?: Body }[];
  body?: Body;
}

export interface StatusScaleSection extends SectionBase {
  type: 'status-scale';
  body?: Body;
}

export interface ProductSection extends SectionBase {
  type: 'product';
  /** Which pages of the sample product to show. */
  pages: ('map' | 'findings' | 'hotspot')[];
  body?: Body;
  links?: LinkItem[];
}

export interface CardsSection extends SectionBase {
  type: 'cards';
  items: { title: string; kicker?: string; body?: Body; link?: LinkItem; tbc?: boolean }[];
  body?: Body;
}

export interface CtaSection extends SectionBase {
  type: 'cta';
  body?: Body;
  links: LinkItem[];
}

export interface OwnersSection extends SectionBase {
  type: 'owners';
}

export interface StatsSection extends SectionBase {
  type: 'stats';
  items: { value: string; label: string; tbc?: boolean }[];
}

/** The whole toolbox, filterable. */
export interface ToolboxSection extends SectionBase {
  type: 'toolbox';
  /** The resource shown as the feature card above the list. */
  feature?: string;
  body?: Body;
}

/** A few named resources, with links on to the toolbox. */
export interface ResourceListSection extends SectionBase {
  type: 'resource-list';
  items: string[];
  body?: Body;
  links?: LinkItem[];
}

export interface DeploymentsSection extends SectionBase {
  type: 'deployments';
  /** Show the world map above the list. */
  map?: boolean;
  /** Show only the first n (most recent first). */
  limit?: number;
  body?: Body;
  links?: LinkItem[];
}

export interface GovernanceSection extends SectionBase {
  type: 'governance';
  layers: {
    id: string;
    name: string;
    short?: string;
    text?: string;
    hidden?: boolean;
    tbc?: boolean;
    members: { name: string; full?: string; role?: string; tbc?: boolean }[];
  }[];
  body?: Body;
}

export interface PartnersSection extends SectionBase {
  type: 'partners';
  body?: Body;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  hint?: string;
  /** Prefill from this query-string parameter (the feedback QR code's link). */
  param?: string;
}

export interface FormSection extends SectionBase {
  type: 'form';
  kind: 'adopt' | 'feedback';
  /** The email's subject line. */
  subject: string;
  fields: FormField[];
  submit: string;
  body?: Body;
}

/** The data collection guide's pages, in order. */
export interface GuidePagesSection extends SectionBase {
  type: 'guide-pages';
  body?: Body;
}

export interface CalloutSection extends SectionBase {
  type: 'callout';
  tone: 'failure' | 'tip' | 'kobo-mcp' | 'note';
  body: Body;
}

export type Section =
  | HeroSection
  | ProseSection
  | AudiencesSection
  | RowsSection
  | StepsSection
  | TableSection
  | TimelineSection
  | StatusScaleSection
  | ProductSection
  | CardsSection
  | CtaSection
  | OwnersSection
  | StatsSection
  | ToolboxSection
  | ResourceListSection
  | DeploymentsSection
  | GovernanceSection
  | PartnersSection
  | FormSection
  | GuidePagesSection
  | CalloutSection;

export type SectionType = Section['type'];

export interface Page {
  slug: string;
  title: string;
  description?: string;
  /** Handbook's layout: a contents list beside a reading column, built from the sections' titles. */
  toc?: boolean;
  sections: Section[];
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export interface Deployment {
  id: string;
  title: string;
  kind: 'response' | 'exercise' | 'training' | 'workshop' | 'event' | 'pilot';
  status: 'done' | 'active' | 'planned';
  /** How the partners supported it. */
  mode?: 'deployed' | 'remote' | 'both';
  /** The RISA deployment scenario, for responses and exercises. */
  scenario?: 'full' | 'hybrid' | 'rapid';
  place: string;
  countries: string[];
  /** ISO 3166-1 alpha-3 codes, for the world map. */
  iso3: string[];
  locations?: { name: string; lat: number; lon: number }[];
  hazard?: string;
  /** yyyy-mm-dd, yyyy-mm or yyyy (or yyyy-Qn). */
  start: string;
  end?: string;
  partners: string[];
  summary: string;
  facts?: { label: string; value: string; tbc?: boolean }[];
  products?: string[];
  lessons?: string[];
  resources?: string[];
  note?: string;
  tbc?: boolean;
  blocks: Body;
  /** The body's h2s, for the contents list. */
  headings: TocEntry[];
}

export type ResourceStatus = 'available' | 'draft' | 'in-progress' | 'planned';
export type ResourceCategory = 'sop' | 'forms' | 'gis' | 'training' | 'comms';

export interface Resource {
  id: string;
  order: number;
  category: ResourceCategory;
  code: string;
  title: string;
  version?: string;
  status: ResourceStatus;
  /** Take the status of another resource (the codebook follows the template). */
  follows?: string;
  owner: string;
  format?: string;
  languages?: string[];
  updated?: string;
  summary: string;
  details?: string[];
  /** Download buttons, shown only when the resource is `available`. Paths under /files/. */
  files?: { label: string; path: string }[];
  /** A page to read it online (on this site or off it). */
  link?: LinkItem;
  note?: string;
  tbc?: boolean;
}

export interface GuidePage {
  /** '' for the guide's overview page (index.md). */
  slug: string;
  title: string;
  order: number;
  annexRef?: string;
  summary: string;
  lastChecked: string;
  blocks: Body;
  /** The body's h2s, for the contents list. */
  headings: TocEntry[];
}

export type { Status };
