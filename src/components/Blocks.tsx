import { useState, type MouseEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import type { Block, Body } from '../lib/types';
import { isRouterLink } from '../lib/url';
import { StatusLegend } from './brand/Status';
import { Codebook } from './guide/Codebook';
import { DownloadCard } from './guide/DownloadCard';
import { GuidePageList } from './guide/GuidePageList';
import classes from './Blocks.module.css';

const COMPONENTS: Record<Extract<Block, { type: 'component' }>['name'], () => ReactNode> = {
  'download-card': () => <DownloadCard />,
  codebook: () => <Codebook />,
  'status-scale': () => <StatusLegend />,
  'guide-pages': () => <GuidePageList />,
};

export const CALLOUT_LABELS = { failure: 'Common failure', tip: 'Tip', 'kobo-mcp': 'With kobo-mcp', note: 'Note' } as const;

/**
 * Markdown rendered at build time (scripts/markdown.mjs). Links inside the
 * site go through the router, so they don't reload the page.
 */
export function Blocks({ body, className }: { body?: Body; className?: string }) {
  const navigate = useNavigate();
  if (!body?.length) return null;
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a');
    const href = a?.getAttribute('href');
    if (!a || !href || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (isRouterLink(href)) {
      e.preventDefault();
      navigate(href);
    }
  };
  return (
    // Clicks bubble up from the rendered links; keyboard users get real <a> elements.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={`${classes.prose} ${className ?? ''}`} onClick={onClick}>
      {body.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'html':
      return <div className={classes.html} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title}>
          {block.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </Callout>
      );
    case 'tabs':
      return <Tabs tabs={block.tabs} />;
    case 'prompt':
      return <Prompt text={block.text} tool={block.tool} />;
    case 'component':
      return <>{COMPONENTS[block.name]?.()}</>;
  }
}

export function Callout({ tone, title, children }: { tone: keyof typeof CALLOUT_LABELS; title?: string; children: ReactNode }) {
  const label = CALLOUT_LABELS[tone];
  return (
    <aside className={classes.callout} data-tone={tone}>
      <p className={classes.calloutLabel}>{title ?? label}</p>
      {children}
    </aside>
  );
}

/**
 * Tabs that read without JavaScript: until the page hydrates (html.js is set
 * by index.html), every panel shows, each under its own heading.
 */
function Tabs({ tabs }: { tabs: Extract<Block, { type: 'tabs' }>['tabs'] }) {
  const [active, setActive] = useState(0);
  const base = tabs.map((t) => t.label).join('|').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().slice(0, 40);
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };
  return (
    <div className={classes.tabs}>
      <div role="tablist" className={classes.tablist} onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t.label}
            {t.badge && <span className={classes.badge}>{t.badge}</span>}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${base}-panel-${i}`}
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
          className={classes.panel}
        >
          <p className={classes.panelTitle}>
            {t.label}
            {t.badge && <span className={classes.badge}>{t.badge}</span>}
          </p>
          {t.blocks.map((b, j) => (
            <BlockView key={j} block={b} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** A prompt to paste into an AI assistant, with the kobo-mcp tool it calls. */
function Prompt({ text, tool }: { text: string; tool?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard access (an old browser, or not allowed): the text is there to select.
    }
  };
  return (
    <figure className={classes.prompt}>
      <blockquote>{text}</blockquote>
      <figcaption>
        {tool ? (
          <span>
            kobo-mcp tool: <code>{tool}</code>
          </span>
        ) : (
          <span>Prompt</span>
        )}
        <button type="button" className={classes.copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
          <span className="visually-hidden"> the prompt</span>
        </button>
      </figcaption>
    </figure>
  );
}
