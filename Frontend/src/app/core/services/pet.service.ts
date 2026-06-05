import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly API_URL = 'http://localhost:3000/gallery';

  // Se expande el arreglo a 10 mascotas balanceadas entre estados y especies para pruebas de UI
  private petsSignal = signal<Pet[]>([
    { 
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
      fotoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce' 
    },
    { 
      id: '5', 
      nombre: 'Max', 
      especie: 'Perro', 
      estado: PetStatus.DISPONIBLE, 
      fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e' 
    },
    { 
      id: '6', 
      nombre: 'Copito', 
      especie: 'Conejo', 
      estado: PetStatus.DISPONIBLE, 
      fotoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308' 
    },
    { 
      id: '7', 
      nombre: 'Rocky', 
      especie: 'Perro', 
      estado: PetStatus.ADOPTADO, 
      fotoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a' 
    },
    { 
      id: '8', 
      nombre: 'Simba', 
      especie: 'Gato', 
      estado: PetStatus.PERDIDO, 
      fotoUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5' 
    },
    { 
      id: '9', 
      nombre: 'Oliver', 
      especie: 'Gato', 
      estado: PetStatus.DISPONIBLE, 
      fotoUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec' 
    },
    { 
      id: '10', 
      nombre: 'Bella', 
      especie: 'Perro', 
      estado: PetStatus.RECONECTADO, 
      fotoUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a' 
    }
  ]);

  public pets = this.petsSignal.asReadonly();

  constructor(private http: HttpClient) {}

  public getAllPets(): void {
    this.http.get<Pet[]>(this.API_URL).subscribe({
      next: (data) => this.petsSignal.set(data),
      error: (err) => console.error('Error en la conexión al servidor:', err)
    });
  }

  /**
   * Realiza la actualización del estado en MongoDB y actualiza reactivamente el Signal local.
   */
  public updatePetStatus(id: string, status: PetStatus): Observable<Pet> {
    return this.http.patch<Pet>(`${this.API_URL}/${id}`, { estado: status }).pipe(
      tap(() => {
        this.petsSignal.update((currentPets) =>
          currentPets.map((pet) => (pet.id === id ? { ...pet, estado: status } : pet))
        );
      })
    );
  }
}