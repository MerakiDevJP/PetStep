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
  {
    path: '**',
    redirectTo: 'mascotas'
  },
  {
    path: '**',
    redirectTo: 'mascotas'
  }

];