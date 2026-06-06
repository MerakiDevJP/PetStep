import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  // La URL base que apunta al backend en el puerto 3000
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // 1. Enviar datos del Formulario de Registro de Mascotas
  registrarMascota(mascota: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pets`, mascota);
  }

  // 2. Enviar datos del Formulario de Solicitud de Adopción
  enviarSolicitudAdopcion(solicitud: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/adoptions`, solicitud);
  }

  // 3. Obtener las mascotas disponibles
  obtenerMascotas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pets`);
  }
}