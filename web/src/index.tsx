import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

import './global.css';
import { cn } from './utils/helpers.ts';
import { Logo } from './components/logo.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <header
      className={cn(
        'p-6',
        'backdrop-blur',
        'bg-background/50',
        'sticky',
        'top-0',
        'left-0'
      )}
    >
      <nav className="container">
        <Logo />
      </nav>
    </header>
    <main>
      <App />
    </main>
  </StrictMode>
);
