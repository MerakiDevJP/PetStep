import { Component, Input, OnInit, signal } from '@angular/core'; 
import { CommonModule } from '@angular/common';          
import { FormsModule } from '@angular/forms';
import { Pet, PetStatus } from '../../../core/models/pet.model';
import { Router } from '@angular/router';

/**
 * Se define la unidad visual básica para la representación de cada entidad mascota.
 */
@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-card.component.html',
  styleUrls: ['./pet-card.component.scss']
})
export class PetCardComponent implements OnInit {
  @Input({ required: true }) pet!: Pet;

  // Signal reactivo para el cuadro de texto del nuevo comentario
  public comentariosExpandidos = false;
  public nuevoComentario = signal<string>('');
  
  // Estado para el control de la animación de rotación de la tarjeta
  public isFlipped: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  /**
   * Cambia el estado de rotación de la tarjeta (Efecto Flip).
   */
  public onFlip(): void {
    this.isFlipped = !this.isFlipped;
  }

  public toggleComentarios(): void {
    this.comentariosExpandidos = !this.comentariosExpandidos;
  }

  /**
   * Enrutamiento directo al módulo de adopciones (Corregido sin paréntesis)
   */
  public irAAdopciones(): void {
    this.router.navigate(['/adoption'], { queryParams: { petId: this.pet.id } }); 
  }

  /**
   * Enrutamiento directo al módulo de reportes (Corregido sin paréntesis)
   */
  public irAReportePerdida(): void {
    this.router.navigate(['/reportes/perdida'], { queryParams: { petId: this.pet.id } }); // 
  }

  /**
   * Asigna los colores hexadecimales según tus enums estrictos.
   */
  public getStatusColor(estado: any): string {
    const colors: Record<string, string> = {
      [PetStatus.DISPONIBLE]: '#27AE60',  // Verde
      [PetStatus.EN_PROCESO]: '#F39C12',  // Naranja
      [PetStatus.ADOPTADO]: '#2980B9',    // Azul
      [PetStatus.EXTRAVIADO]: '#C0392B',     // Rojo
      [PetStatus.HALLADO]: '#F1C40F'  // Amarillo
    };
    return colors[estado] || '#BDC3C7';   // Gris por defecto
  }

  /**
   * Añade un comentario de manera reactiva local y limpia el Signal.
   */
  public agregarComentario(): void {
    if (!this.nuevoComentario().trim()) return;

    const nuevoItem = {
      autor: 'Usuario Local', // Simulación temporal de sesión
      texto: this.nuevoComentario().trim(),
      fecha: new Date()
    };

    if (!this.pet.comentarios) {
      this.pet.comentarios = [];
    }

    // Mutación visual del modelo en el Frontend
    this.pet.comentarios.push(nuevoItem);
    
    // Limpieza del Input usando la API de Signals
    this.nuevoComentario.set('');
  }
}