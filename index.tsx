// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Providers de contexto
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </AuthProvider>
  </React.StrictMode>
);
