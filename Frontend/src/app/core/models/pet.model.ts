/**
 * Se define la interfaz Pet que representa el Modelo en el patrón MVVM.
 * Cumple con el principio de abstracción de datos.
 * Principio de Responsabilidad Única (SRP).
 */
export interface Pet {
  id: string;
  nombre: string;
  especie: string;
  estado: PetStatus; // Uso de Enums para evitar datos no válidos
  fotoUrl: string;
}

export enum PetStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_PROCESO = 'EN_PROCESO',
  ADOPTADO = 'ADOPTADO',
  PERDIDO = 'PERDIDO',
  RECONECTADO = 'RECONECTADO'
}