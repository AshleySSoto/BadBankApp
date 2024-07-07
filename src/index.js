import React from "react";
import {createRoot} from 'react-dom/client';
import "../src/index.css";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import {reportUncaughtError} from "./reportError";

const container = document.getElementById('root');
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
  root.render (<React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  );
