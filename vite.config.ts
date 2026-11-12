import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import YAML from 'yaml';
// @ts-expect-error: plain JS, shared with scripts/validate-content.mjs.
import { parseCodebook, parseContentFile } from './scripts/markdown.mjs';

const CONTENT = path.resolve(__dirname, 'content');
const CODEBOOK = path.resolve(__dirname, 'public/files/codebook.md');

/**
 * Content files become data at build time: Markdown is rendered to HTML and
 * YAML parsed here, so the browser gets neither parser. `virtual:codebook` is
 * the synced codebook's tables, for the template page.
 */
function content(): Plugin {
  return {
    name: 'risa-content',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'virtual:codebook') return '\0virtual:codebook';
    },
    load(id) {
      if (id === '\0virtual:codebook') {
        this.addWatchFile(CODEBOOK);
        return `export default ${JSON.stringify(parseCodebook(fs.readFileSync(CODEBOOK, 'utf8')))};`;
      }
      const file = id.split('?')[0];
      if (!file.startsWith(CONTENT)) return;
      if (file.endsWith('.md')) {
        const { data, blocks, toc, errors } = parseContentFile(fs.readFileSync(file, 'utf8'), path.relative(__dirname, file));
        if (errors.length) this.error(errors.join('\n'));
        return `export default ${JSON.stringify({ ...data, blocks, headings: toc })};`;
      }
      if (file.endsWith('.yml')) return `export default ${JSON.stringify(YAML.parse(fs.readFileSync(file, 'utf8')) ?? {})};`;
    },
  };
}

/**
 * `npm run preview` serves dist/ the way App Platform does: /method is
 * dist/method/index.html (no redirect, query string kept), and anything
 * missing gets 404.html. Vite's own preview would serve the home page's HTML
 * for every path, so React would hydrate the wrong page.
 */
function staticHost(): Plugin {
  return {
    name: 'risa-static-host',
    configurePreviewServer(server) {
      const dist = path.resolve(__dirname, 'dist');
      server.middlewares.use((req, res, next) => {
        const [pathname, query = ''] = (req.url ?? '/').split('?');
        const clean = decodeURIComponent(pathname).replace(/\/+$/, '');
        const file = path.join(dist, clean);
        if (!file.startsWith(dist)) return next();
        if (path.extname(clean) && fs.existsSync(file)) return next();
        const page = path.join(file, 'index.html');
        if (!path.extname(clean) && fs.existsSync(page)) {
          req.url = `${clean}/index.html${query ? `?${query}` : ''}`;
          return next();
        }
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(path.join(dist, '404.html')));
      });
    },
  };
}

export default defineConfig(({ isPreview }) => ({
  plugins: [content(), react(), staticHost()],
  appType: isPreview ? 'mpa' : 'spa',
  // The footer's copyright year, fixed at build time so the prerendered HTML
  // and the browser always agree.
  define: { 'import.meta.env.VITE_BUILD_YEAR': JSON.stringify(String(new Date().getFullYear())) },
}));
