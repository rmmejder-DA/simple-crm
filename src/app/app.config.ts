import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideNativeDateAdapter(),
    provideRouter(routes),
    // TODO: durch die echte Firebase-Projektkonfiguration ersetzen
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyDtwFgbUFDzf8uIfdLZJJU2lQSDwNeNVPM",
      authDomain: "simple-crm-30124.firebaseapp.com",
      databaseURL: "https://simple-crm-30124-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "simple-crm-30124",
      storageBucket: "simple-crm-30124.firebasestorage.app",
      messagingSenderId: "195385318437",
      appId: "1:195385318437:web:0378338312dc9a491a33cc"
    })),
    provideFirestore(() => getFirestore())
  ]
};
