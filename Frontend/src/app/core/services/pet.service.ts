import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pet, PetStatus } from '../models/pet.model';

@Injectable({ providedIn: 'root' })
export class PetService {
  // Usamos el prefijo relativo gracias al proxy-config de Angular
  private readonly API_URL = '/api';

  // El Signal arranca limpio (vacío) esperando los datos reales de MongoDB
  private petsSignal = signal<Pet[]>([]);
  public pets = this.petsSignal.asReadonly();

  // Inyección moderna de dependencias en Angular
  private http = inject(HttpClient);

  // =========================================================================
  // MÓDULO GALERÍA / CONSULTAS (Dev3 Optimizations)
  // =========================================================================

  /**
   * Carga la lista completa de mascotas desde la base de datos distribuida
   */
  public getAllPets(): void {
    this.http.get<Pet[]>(`${this.API_URL}/pets`).subscribe({
      next: (data) => this.petsSignal.set(data),
      error: (err) => console.error('Error al conectar con la API de PetStep:', err)
    });
  }

  /**
   * Alias compatible para Dev2: Obtiene las mascotas disponibles en formato de Observable
   */
  public obtenerMascotas(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.API_URL}/pets`);
  }

  /**
   * Modifica el estado de una mascota en MongoDB y actualiza reactivamente la interfaz
   */
  public updatePetStatus(id: string, status: PetStatus): Observable<Pet> {
    return this.http.patch<Pet>(`${this.API_URL}/pets/${id}/status`, { estado: status }).pipe(tap((updatedPet) => {
      this.petsSignal.update((currentPets) =>
        currentPets.map((pet) => (pet.id === id ? { ...pet, estado: updatedPet.estado } : pet))
      );
    })
    );
  }
  // =========================================================================
  // MÓDULO FORMULARIOS / PERSISTENCIA (Dev2 Integrations)
  // =========================================================================

  /**
   * 1. Enviar datos del Formulario de Registro de Mascotas (Administrador)
   */
  public registrarMascota(mascota: any): Observable<any> {
    return this.http.post(`${this.API_URL}/pets`, mascota);
  }

  /**
   * 2. Enviar datos del Formulario de Solicitud de Adopción o Reporte de Extraviado
   */
  public enviarSolicitudAdopcion(solicitud: any): Observable<any> {
    if (solicitud.tipoFormulario === 'lost') {
      return this.http.post(`${this.API_URL}/lost-reports`, solicitud);
    }
    return this.http.post(`${this.API_URL}/adoptions`, solicitud);
  }

  /**
   * Alias genérico alternativo para procesos del Frontend unificado
   */
  public crearSolicitud(solicitud: any): Observable<any> {
    return this.enviarSolicitudAdopcion(solicitud);
  }

}