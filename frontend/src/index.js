// javascript
// file: `frontend/src/index.js`

// Guard React DevTools global hook to avoid "Invalid argument not valid semver" errors.
if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  try {
    if (hook.renderers && typeof hook.renderers.forEach === 'function') {
      hook.renderers.forEach((renderer) => {
        try { if (!renderer || !renderer.version) renderer.version = '0.0.0'; } catch (e) {}
      });
    }
    if (hook._renderers && typeof hook._renderers === 'object') {
      Object.keys(hook._renderers).forEach((id) => {
        try {
          const r = hook._renderers[id];
          if (r && !r.version) r.version = '0.0.0';
        } catch (e) {}
      });
    }
  } catch (e) { /* ignore */ }
}

// Dynamically import React and mount the app after the guard runs.
(async () => {
  try {
    const ReactMod = await import('react');
    const ReactDOMClient = await import('react-dom/client');
    const AppMod = await import('./App'); // adjust path if your root component file differs
    // optional: import global css if present
    try { await import('./index.css'); } catch (e) { /* ignore if missing */ }

    const React = ReactMod.default || ReactMod;
    const createRoot = ReactDOMClient.createRoot;
    const App = AppMod.default || AppMod;

    let rootEl = document.getElementById('root');
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.id = 'root';
      document.body.appendChild(rootEl);
    }

    createRoot(rootEl).render(
      React.createElement(React.StrictMode, null, React.createElement(App, null))
    );
  } catch (err) {
    // If mounting fails, log to console for debugging.
    // Keep this minimal to avoid noisy errors in production.
    // eslint-disable-next-line no-console
    console.error('Failed to start app', err);
  }
})();
