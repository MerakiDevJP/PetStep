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
    path: 'registro-mascota',
    loadComponent: () =>
      import(
        './features/adoption/pages/pet-register/pet-register'
      )
      .then(m => m.PetRegister)
  },
  {
      path: 'trazabilidad',
      loadComponent: () =>
        import('./features/traceability/traceability.component')
        .then(m => m.TraceabilityComponent)
  },
  {
  path: 'pet-register',
  loadComponent: () =>
    import('./features/adoption/pages/pet-register/pet-register')
    .then(m => m.PetRegister)
  },

  {
      path: 'adopt-responsable',
      loadComponent: () =>
        import('./features/responsible-adopt/responsible-adopt.component')
        .then(m => m.ResponsibleAdoptComponent)
  },
  
  {
    path: '**',
    redirectTo: 'mascotas'
  }

];