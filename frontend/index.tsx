
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import AppErrorBoundary from './components/AppErrorBoundary';

function AppWithRecovery() {
  const location = useLocation();
  return <AppErrorBoundary resetKey={location.pathname}><App /></AppErrorBoundary>;
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppWithRecovery />
    </BrowserRouter>
  </React.StrictMode>
);
