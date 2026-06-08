import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  private readonly API_URL ='http://localhost:3000/api/pets';
  private petsSignal = signal<Pet[]>([]);
  public pets = this.petsSignal.asReadonly();
  private http = inject(HttpClient);

  public getAllPets(): void {
    this.http.get<Pet[]>(this.API_URL).subscribe({
      next: (data) => this.petsSignal.set(data),
      error: (err) => console.error('Error al conectar con la API de PetStep:', err)
    });
  }

  public updatePetStatus(id: string, status: PetStatus): Observable<Pet> {
    return this.http.patch<Pet>(`${this.API_URL}/${id}/status`, { estado: status }).pipe(
      tap((updatedPet) => {
        this.petsSignal.update((currentPets) =>
          currentPets.map((pet) => (pet.id === id ? { ...pet, estado: updatedPet.estado } : pet))
        );
      })
    );
  }

  public registrarMascota(petData: any): Observable<any> {
    return this.http.post<any>(this.API_URL, petData);
  }
}