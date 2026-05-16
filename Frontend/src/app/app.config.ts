import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // Necesario para el CRUD
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), 
    provideRouter(routes), // Configuración de rutas para la navegación
    provideHttpClient() // Se habilita el cliente HTTP para el patrón Client-Server
  ]
};