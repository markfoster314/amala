import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@markfoster314/marduk/styles.css';
import './index.css';
import App from './App.tsx';

import { defineBoxPresets } from '@markfoster314/marduk';

defineBoxPresets({
  homeContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
  },
  homeContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
