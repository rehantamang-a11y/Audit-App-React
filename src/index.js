import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { FormProvider } from './context/FormContext';
import { PhotoProvider } from './context/PhotoContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormProvider>
      <PhotoProvider>
        <App />
      </PhotoProvider>
    </FormProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
