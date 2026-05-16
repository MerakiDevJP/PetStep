import { Component, Input, OnInit } from '@angular/core'; // Correcto: desde @angular/core
import { CommonModule } from '@angular/common';          // Correcto: desde @angular/common
import { Pet } from '../../../core/models/pet.model';

/**
 * Se define la unidad visual básica para la representación de cada entidad mascota.
 */
@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss']
})
export class PetCardComponent implements OnInit {
  @Input({ required: true }) pet!: Pet;

  public isFlipped: boolean = false;
  public statusColor: string = '#BDC3C7';

  ngOnInit(): void {
    this.statusColor = this._calculateStatusColor();
  }

  private _calculateStatusColor(): string {
    const colors: Record<string, string> = {
      'DISPONIBLE': '#27AE60',
      'EN_PROCESO': '#F39C12',
      'ADOPTADO': '#2980B9',
      'PERDIDO': '#C0392B',
      'RECONECTADO': '#F1C40F'
    };
    return colors[this.pet.estado] || '#BDC3C7';
  }

  public onFlip(): void {
    this.isFlipped = !this.isFlipped;
  }
}