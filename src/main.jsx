import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './fonts.css';
import './palette.css';
import './site-experience.css';
import './styles.css';

function renderFileProtocolHelp(container) {
  container.innerHTML =
    '<div style="padding:24px;max-width:40em;font-family:system-ui,sans-serif;line-height:1.55;background:#fafafa;color:#222">' +
    '<strong>This page was opened as a file</strong> (address starts with <code>file://</code>). ' +
    'Browsers usually block the app from running that way, which looks like a white screen.<br><br>' +
    'From the project folder run <code style="background:#eee;padding:2px 8px;border-radius:4px">npm run preview</code> ' +
    'and open the URL it prints, or deploy the <code>dist</code> folder to Netlify, Vercel, GitHub Pages, etc.</div>';
}

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            maxWidth: 640,
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.5,
          }}
        >
          <h1 style={{ fontSize: 18, marginBottom: 12 }}>Something went wrong</h1>
          <pre
            style={{
              background: '#f4f4f4',
              padding: 12,
              overflow: 'auto',
              fontSize: 13,
            }}
          >
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function mount() {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    renderFileProtocolHelp(container);
    return;
  }
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const routerBasename =
    baseUrl === '/' || baseUrl === './' ? '' : baseUrl.replace(/\/$/, '');
  const routerProps = routerBasename ? { basename: routerBasename } : {};
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter {...routerProps}>
        <RootErrorBoundary>
          <App />
        </RootErrorBoundary>
      </BrowserRouter>
    </React.StrictMode>,
  );
}

mount();
