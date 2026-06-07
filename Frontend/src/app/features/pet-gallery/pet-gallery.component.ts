import { Component, inject, computed, signal, OnInit } from '@angular/core'; // Se añade 'signal'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { PetCardComponent } from '../../shared/components/pet-card/pet-card.component';
import { PetService } from '../../core/services/pet.service';
import { PetStatus } from '../../core/models/pet.model';

@Component({
  selector: 'app-pet-gallery',
  standalone: true,
  imports: [CommonModule, PetCardComponent],
  templateUrl: './pet-gallery.component.html',
  styleUrls: ['./pet-gallery.component.scss']
})
export class PetGalleryComponent implements OnInit {
  private readonly _petService = inject(PetService);
  private readonly _router = inject(Router);
  
  /**
   * Ciclo de vida inicial: Manda a llamar a las mascotas del backend
   */
  ngOnInit(): void {
    this._petService.getAllPets();
  }

  /**
   * Estado reactivo local para almacenar el filtro por especie.
   */
  private _criterioBusqueda = signal<string>('');

  /** 
   * Se utilizan Signals computados para derivar las listas filtradas.
   * Reaccionan automáticamente si cambia el estado global en el servicio o el criterio de búsqueda.
   */
  public enAdopcion = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.DISPONIBLE)
  );

  public enProceso = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.EN_PROCESO)
  );

  public adoptados = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.ADOPTADO)
  );

  public perdidos = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.PERDIDO)
  );

  public recuperados = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.RECONECTADO)
  );

  /**
   * Método encargado de gestionar la redirección al formulario global de reportes.
   * Vinculado directamente al evento (click) del botón en la sección de Perdidos.
   */
  public irAReportePerdida(): void {
    // Ajusta la ruta '/reportar-perdida' según cómo la tengas declarada en tu app.routes.ts
    this._router.navigate(['/reportar-perdida']); 
  }
  
  /**
   * Captura el valor del input de búsqueda al presionar la tecla Enter.
   * Se realiza la limpieza de espacios y estandarización a minúsculas.
   * @param evento Evento del DOM proveniente del teclado
   */
  public onBuscarPorEspecie(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    // Se actualiza el signal, gatillando de inmediato el recalculo de los computed
    this._criterioBusqueda.set(inputElement.value.trim().toLowerCase());
  }

  /**
   * Encapsula la lógica de filtrado doble (Estado + Especie) para cumplir con el principio SRP.
   */
  private _filtrarMascotasPorEspecie(estado: PetStatus) {
    const columnasMascotas = this._petService.pets();
    const filtro = this._criterioBusqueda();

    // 1. Filtrado base por el estado en el proceso
    const filtradasPorEstado = columnasMascotas.filter(p => p.estado === estado);

    // Si el input está vacío, retornamos la lista completa de ese estado
    if (!filtro) {
      return filtradasPorEstado;
    }

    // 2. Filtro doble: Verifica si el término coincide con el nombre O con la especie
    return filtradasPorEstado.filter(p => 
      (p.nombre && p.nombre.toLowerCase().includes(filtro)) || 
      (p.especie && p.especie.toLowerCase().includes(filtro))
    );
  }
}