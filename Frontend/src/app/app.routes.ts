import { Routes } from '@angular/router';

/**
 * Se definen las rutas de la aplicación siguiendo el patrón SPA.
 */
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'mascotas',
    pathMatch: 'full'
  },

  {
    path: 'mascotas',
    loadComponent: () =>
      import('./features/pet-gallery/pet-gallery.component')
      .then(m => m.PetGalleryComponent)
  },

  {
    path: 'conocenos',
    loadComponent: () =>
      import('./features/about/about.component')
      .then(m => m.AboutComponent)
  },

  {
    path: 'adoption',
    loadComponent: () =>
      import(
        './features/adoption/pages/adoption-request/adoption-request'
      )
      .then(m => m.AdoptionRequest)
  },

  {
      path: 'trazabilidad',
      loadComponent: () =>
        import('./features/traceability/traceability.component')
        .then(m => m.TraceabilityComponent)
  },

  {
      path: 'edu-responsable',
      loadComponent: () =>
        import('./features/responsible-edu/responsible-edu.component')
        .then(m => m.ResponsibleEduComponent)
  },
  {
    path: '**',
    redirectTo: 'mascotas'
  }

];