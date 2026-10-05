import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught errors from crashing the top-level application in preview iframes
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    let combined = '';
    try {
      combined = [
        typeof reason === 'string' ? reason : '',
        reason?.message || '',
        reason?.reason || '',
        reason?.name || '',
        reason?.description || '',
        reason?.error || '',
        String(reason || ''),
        typeof reason === 'object' && reason !== null ? JSON.stringify(reason) : '',
      ].join(' ').toLowerCase();
    } catch {
      combined = String(reason || '').toLowerCase();
    }

    if (
      combined.includes('websocket') || 
      combined.includes('closed without opened') ||
      combined.includes('system_savepoints') ||
      combined.includes('schema cache') ||
      combined.includes('closeevent') ||
      combined.includes('networkerror') ||
      combined.includes('failed to fetch') ||
      combined.includes('abort')
    ) {
      event.preventDefault();
      return;
    }
    console.warn('[Global Resilience] Unhandled promise rejection suppressed:', reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    const errorMsg = (event.message || event.error?.message || String(event.error || '')).toLowerCase();
    if (
      errorMsg.includes('resizeobserver') || 
      errorMsg.includes('quotaexceedederror') ||
      errorMsg.includes('websocket') ||
      errorMsg.includes('closed without opened') ||
      errorMsg.includes('system_savepoints') ||
      errorMsg.includes('schema cache')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
