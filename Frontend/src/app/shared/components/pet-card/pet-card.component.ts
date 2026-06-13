import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Pet, PetStatus } from '../../../core/models/pet.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-card.component.html',
  styleUrl: './pet-card.component.scss'
})
export class PetCardComponent {
  @Input() pet!: Pet | any;

  public authService = inject(AuthService); // ✅ servicio de autenticación

  isFlipped = false;
  comentariosExpandidos = false;
  nuevoComentario = signal('');

  constructor(private router: Router, private http: HttpClient) {}

  public onFlip(): void {
    this.isFlipped = !this.isFlipped;
  }

  public toggleComentarios(): void {
    this.comentariosExpandidos = !this.comentariosExpandidos;
  }

  public agregarComentario(): void {
    this.nuevoComentario.set('');
  }

  public irAAdopciones(): void {
    if (this.pet) {
      const idMascota = this.pet._id || this.pet.id;
      this.router.navigate(['/adoption'], {
        queryParams: {
          tipo: 'adopcion',
          mascota: this.pet.nombre,
          mascotaId: idMascota
        }
      });
    }
  }

  public marcarRecuperado(): void {
    const id = this.pet._id || this.pet.id;

    let nuevoEstado = '';
    if (this.pet.estado === 'PERDIDO')      nuevoEstado = 'RECUPERADO';
    if (this.pet.estado === 'RECUPERADO')   nuevoEstado = 'DISPONIBLE';
    if (this.pet.estado === 'EN PROCESO')   nuevoEstado = 'ADOPTADO';
    if (this.pet.estado === 'ADOPTADO')     nuevoEstado = 'DISPONIBLE';

    if (!nuevoEstado) return;

    this.http.patch(`/api/pets/${id}/status`, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.pet = { ...this.pet, estado: nuevoEstado };
        this.isFlipped = false;
      },
      error: (err) => console.error('Error al cambiar estado:', err)
    });
  }

  public getStatusColor(estado: PetStatus): string {
    const colors: Record<string, string> = {
      [PetStatus.DISPONIBLE]:  '#27AE60',
      [PetStatus.EN_PROCESO]:  '#F39C12',
      [PetStatus.ADOPTADO]:    '#2980B9',
      [PetStatus.PERDIDO]:     '#C0392B',
      [PetStatus.RECUPERADO]:  '#8E44AD',
    };
    return colors[estado] ?? '#95A5A6';
  }
}