import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

// --- INICIO DEL PARCHE (Copiado de index.js) ---
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
// --- FIN DEL PARCHE ---

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);