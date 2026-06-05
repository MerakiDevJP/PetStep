import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  // Usamos el prefijo relativo gracias al proxy-config de Angular
  private readonly API_URL = '/api/pets';

  // El Signal arranca limpio (vacío) esperando los datos reales de MongoDB
  private petsSignal = signal<Pet[]>([]);
  public pets = this.petsSignal.asReadonly();

  // Inyección moderna de dependencias en Angular
  private http = inject(HttpClient);

  /**
   * Carga la lista completa de mascotas desde la base de datos distribuida
   */
  public getAllPets(): void {
    this.http.get<Pet[]>(this.API_URL).subscribe({
      next: (data) => this.petsSignal.set(data),
      error: (err) => console.error('Error al conectar con la API de PetStep:', err)
    });
  }

  /**
   * Modifica el estado de una mascota en MongoDB y actualiza reactivamente la interfaz
   */
  public updatePetStatus(id: string, status: PetStatus): Observable<Pet> {
    return this.http.patch<Pet>(`${this.API_URL}/${id}/status`, { estado: status }).pipe(
      tap((updatedPet) => {
        this.petsSignal.update((currentPets) =>
          currentPets.map((pet) => (pet.id === id ? { ...pet, estado: updatedPet.estado } : pet))
        );
      })
    );
  }
}