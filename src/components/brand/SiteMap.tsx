import { useId } from 'react';
import { siteMapSvg, type SiteMapOptions } from '../../lib/sitemap';
import './sitemap.css';

/** The sample site map (fictional data). Size it with the wrapper: it fills its box. */
export function SiteMap({ className, ...opts }: SiteMapOptions & { className?: string }) {
  // useId is stable between the server and the browser; SVG ids need plain characters.
  const id = `sm${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return <div className={`risa-sitemap ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: siteMapSvg(id, opts) }} />;
}
