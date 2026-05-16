import { Routes } from '@angular/router';
import { PetGalleryComponent } from './features/pet-gallery/pet-gallery.component';

/**
 * Se definen las rutas de la aplicación siguiendo el patrón SPA.
 * Se mapea la ruta raíz al componente de galería para el renderizado inicial.
 */
export const routes: Routes = [
  { path: '', component: PetGalleryComponent }, // Al entrar a localhost:4200 carga esto
  { path: 'gallery', component: PetGalleryComponent }, // localhost:4200/gallery
  { path: '**', redirectTo: '' } // Cualquier otra cosa, vuelve al inicio
];