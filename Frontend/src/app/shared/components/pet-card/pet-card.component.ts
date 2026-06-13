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
   * Enrutamiento directo al módulo de adopciones con paso de contexto completo.
   * Envía 'tipo', 'mascota' (nombre) y 'mascotaId' (ID de Mongo)
   */
  public irAAdopciones(): void {
    if (this.pet) {
      // Validación preventiva para capturar el ID de MongoDB de cualquier forma (_id o id)
      const idMascota = this.pet._id || this.pet.id;
      
      this.router.navigate(['/adoption'], { 
        queryParams: { 
          tipo: 'adopcion',            // Pre-selecciona la opción en el formulario
          mascota: this.pet.nombre,  // Muestra el nombre en el frontend (soporta nombre o name)
          mascotaId: idMascota         // Envía el ID real que validará Express
        } 
      });
    }
  }

  /**
   * Enrutamiento directo al módulo de reportes (Se mantiene apuntando a tu ruta global)
   */
  public irAReportePerdida(): void {
    const idMascota = this.pet._id || this.pet.id;
    this.router.navigate(['/adoption'], { 
      queryParams: { 
        tipo: 'extraviado',
        mascotaId: idMascota 
      } 
    });
  }

  /**
   * Asigna los colores hexadecimales según tus enums estrictos.
   */
  public getStatusColor(estado: PetStatus): string {
    const colors: Record<string, string> = {
      [PetStatus.DISPONIBLE]: '#27AE60',  // Verde
      [PetStatus.EN_PROCESO]: '#F39C12',  // Naranja
      [PetStatus.ADOPTADO]: '#2980B9',    // Azul
      [PetStatus.PERDIDO]: '#C0392B',     // Rojo
      [PetStatus.RECUPERADO]: '#F1C40F'   // Amarillo
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