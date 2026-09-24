import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught errors from crashing the top-level application in preview iframes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Global Resilience] Unhandled promise rejection suppressed:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Suppress benign iframe resize or storage quota errors
    if (event.message?.includes('ResizeObserver') || event.message?.includes('QuotaExceededError')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
