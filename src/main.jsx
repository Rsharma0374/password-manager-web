import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './store/authStore';
import { encryptionService } from './services/EncryptionService';

// Initialize encryption service before rendering
encryptionService.initialize()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
    );
  })
  .catch(error => {
    console.error('Failed to initialize encryption service:', error);
    // You might want to show an error page or handle this case appropriately
  });
