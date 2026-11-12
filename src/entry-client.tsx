import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter basename={base || '/'}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Production pages are prerendered to HTML (scripts/prerender.mjs), so hydrate
// them; the dev server serves an empty shell, so render from scratch.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
