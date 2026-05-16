import { Component, inject, computed } from '@angular/core'; // Importar computed
import { CommonModule } from '@angular/common';
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
export class PetGalleryComponent {
  private readonly _petService = inject(PetService);

  /** * Se utilizan Signals computados para derivar las listas filtradas.
   * Esto garantiza que la UI se actualice automáticamente si un estado cambia.
   */
  public enAdopcion = computed(() => 
    this._petService.pets().filter(p => p.estado === PetStatus.DISPONIBLE)
  );

  public adoptados = computed(() => 
    this._petService.pets().filter(p => p.estado === PetStatus.ADOPTADO)
  );

  public perdidos = computed(() => 
    this._petService.pets().filter(p => p.estado === PetStatus.PERDIDO)
  );

  public recuperados = computed(() => 
    this._petService.pets().filter(p => p.estado === PetStatus.RECONECTADO)
  );
}