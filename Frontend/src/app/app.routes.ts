import { Routes } from '@angular/router';
import { PetGalleryComponent } from './features/pet-gallery/pet-gallery.component';

/**
 * Se definen las rutas de la aplicación siguiendo el patrón SPA.
 * Se mapea la ruta raíz al componente de galería para el renderizado inicial.
 */
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'mascotas', 
    pathMatch: 'full' 
  },
  { 
    path: 'mascotas', 
    loadComponent: () => import('./features/pet-gallery/pet-gallery.component').then(m => m.PetGalleryComponent) 
  },
  { 
    path: 'conocenos', 
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) 
  },
  /*{ 
    path: 'adopcion', 
    loadComponent: () => import('./features/adoption-form/adoption-form.component').then(m => m.AdoptionFormComponent) 
  },
  // Rutas futuras para expandir el sistema MEAN
  { 
    path: 'reportes', 
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) 
  },
  { 
    path: 'auth', 
    loadComponent: () => import('./features/auth/login().component').then(m => m.LoginComponent) 
  },*/
  { 
    path: '**', 
    redirectTo: 'mascotas' 
  }
];