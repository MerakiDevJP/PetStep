import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly API_URL = 'http://localhost:3000/api/pets';

  // Se utiliza el patrón Observer a través de Signals para actualizaciones en tiempo real.
  private petsSignal = signal<Pet[]>([{ 
      id: '1', 
      nombre: 'Thor', 
      especie: 'Perro', 
      estado: PetStatus.DISPONIBLE, 
      fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1' 
    },
    { 
      id: '2', 
      nombre: 'Mishi', 
      especie: 'Gato', 
      estado: PetStatus.ADOPTADO, 
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' 
    },
    { 
      id: '3', 
      nombre: 'Sasha', 
      especie: 'Perro', 
      estado: PetStatus.PERDIDO, 
      fotoUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8' 
    },
    { 
      id: '4', 
      nombre: 'Luna', 
      especie: 'Gato', 
      estado: PetStatus.RECONECTADO, 
      fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba' 
    }
]);
  public pets = this.petsSignal.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Ejecuta la operación de lectura (Read) del CRUD conectando con el Backend.
   * Aplica el manejo de errores mediante operadores reactivos.
   * Patrón Observer & API REST
   */
  public getAllPets(): void {
    this.http.get<Pet[]>(this.API_URL).subscribe({
      next: (data) => this.petsSignal.set(data),
      error: (err) => console.error('Error en la conexión al servidor:', err)
    });
  }

  /**
   * Realiza la actualización (Update) del estado de la mascota.
   * El cambio se refleja en la persistencia de MongoDB.
   */
  public updatePetStatus(id: string, status: string) {
    return this.http.patch(`${this.API_URL}/${id}`, { estado: status });
  }
}