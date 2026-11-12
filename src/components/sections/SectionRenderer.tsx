import type { Section } from '../../lib/types';
import { FormSection } from './FormSection';
import { HeroSection } from './HeroSection';
import { DeploymentsSection, ResourceListSection, ToolboxSection } from './LibrarySections';
import {
  AudiencesSection,
  CalloutSection,
  CardsSection,
  CtaSection,
  GovernanceSection,
  GuidePagesSection,
  OwnersSection,
  PartnersSection,
  ProductSection,
  ProseSection,
  RowsSection,
  StatsSection,
  StatusScaleSection,
  StepsSection,
  TableSection,
  TimelineSection,
} from './TextSections';

/** Draws a page's sections in order. The types are in src/lib/types.ts; the format in content/README.md. */
export function SectionRenderer({ sections, inColumn }: { sections: Section[]; inColumn?: boolean }) {
  return (
    <>
      {sections
        .filter((s) => !s.hidden)
        .map((s, i) => (
          <SectionView key={s.id ?? `${s.type}-${i}`} section={s} inColumn={inColumn} />
        ))}
    </>
  );
}

function SectionView({ section: s, inColumn }: { section: Section; inColumn?: boolean }) {
  switch (s.type) {
    case 'hero':
      return <HeroSection section={s} />;
    case 'prose':
      return <ProseSection section={s} />;
    case 'audiences':
      return <AudiencesSection section={s} />;
    case 'rows':
      return <RowsSection section={s} />;
    case 'steps':
      return <StepsSection section={s} />;
    case 'table':
      return <TableSection section={s} />;
    case 'timeline':
      return <TimelineSection section={s} />;
    case 'status-scale':
      return <StatusScaleSection section={s} />;
    case 'product':
      return <ProductSection section={s} />;
    case 'cards':
      return <CardsSection section={s} />;
    case 'cta':
      return <CtaSection section={s} inColumn={inColumn} />;
    case 'owners':
      return <OwnersSection />;
    case 'stats':
      return <StatsSection section={s} />;
    case 'toolbox':
      return <ToolboxSection section={s} />;
    case 'resource-list':
      return <ResourceListSection section={s} />;
    case 'deployments':
      return <DeploymentsSection section={s} />;
    case 'governance':
      return <GovernanceSection section={s} />;
    case 'partners':
      return <PartnersSection section={s} />;
    case 'form':
      return <FormSection section={s} />;
    case 'guide-pages':
      return <GuidePagesSection section={s} />;
    case 'callout':
      return <CalloutSection section={s} />;
  }
}

/** The section types SectionRenderer knows; scripts/validate-content.mjs keeps a copy. */
export const SECTION_TYPES = [
  'hero', 'prose', 'audiences', 'rows', 'steps', 'table', 'timeline', 'status-scale', 'product', 'cards', 'cta',
  'owners', 'stats', 'toolbox', 'resource-list', 'deployments', 'governance', 'partners', 'form', 'guide-pages', 'callout',
] as const;
