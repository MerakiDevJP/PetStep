import { Component, inject, computed, signal, OnInit } from '@angular/core'; 
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
  
  ngOnInit(): void {
    this._petService.getAllPets();
  }

  private _criterioBusqueda = signal<string>('');

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
    this._filtrarMascotasPorEspecie(PetStatus.EXTRAVIADO)
  );

  public recuperados = computed(() => 
    this._filtrarMascotasPorEspecie(PetStatus.HALLADO)
  );

  public irAReportePerdida(): void {
    this._router.navigate(['/reportar-extraviado']); 
  }
  
  public onBuscarPorEspecie(evento: Event): void {
    const inputElement = evento.target as HTMLInputElement;
    this._criterioBusqueda.set(inputElement.value.trim().toLowerCase());
  }

  private _filtrarMascotasPorEspecie(estado: PetStatus) {
    const columnasMascotas = this._petService.pets();
    const filtro = this._criterioBusqueda();

    // Corrección aquí: Forzar toString() para evitar discrepancias estrictas string vs Enum
    const filtradasPorEstado = columnasMascotas.filter(p => p.estado.toString() === estado.toString());

    if (!filtro) {
      return filtradasPorEstado;
    }

    return filtradasPorEstado.filter(p => 
      (p.nombre && p.nombre.toLowerCase().includes(filtro)) || 
      (p.especie && p.especie.toLowerCase().includes(filtro))
    );
  }
}