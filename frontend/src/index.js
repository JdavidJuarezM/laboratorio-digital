if (typeof window !== 'undefined' && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  try {
    if (hook.renderers && typeof hook.renderers.forEach === 'function') {
      hook.renderers.forEach((renderer) => {
        try {
          if (!renderer || !renderer.version) renderer.version = '0.0.0';
        } catch { /* intentional no-op */ }
      });
    }
    if (hook._renderers && typeof hook._renderers === 'object') {
      Object.keys(hook._renderers).forEach((id) => {
        try {
          const r = hook._renderers[id];
          if (r && !r.version) r.version = '0.0.0';
        } catch { /* intentional no-op */ }
      });
    }
  } catch { /* ignore */ }
}

(async () => {
  try {
    const ReactMod = await import('react');
    const ReactDOMClient = await import('react-dom/client');
    const AppMod = await import('./App');
    try { await import('./index.css'); } catch { /* ignore if missing */ }

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
    console.error('Failed to start app', err);
  }
})();