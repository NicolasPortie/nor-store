import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './lib/gsap';
import 'lenis/dist/lenis.css';
import './styles.css';
import { App } from './App';
import { LocaleProvider } from './i18n/locale';

const container = document.getElementById('root')!;
const root = (window as Window & { __norRoot?: ReturnType<typeof createRoot> }).__norRoot ?? createRoot(container);
(window as Window & { __norRoot?: ReturnType<typeof createRoot> }).__norRoot = root;

root.render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
);
