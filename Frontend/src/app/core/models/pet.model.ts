/**
 * Se define la interfaz Comment para encapsular las interacciones de los usuarios.
 */
export interface Comment {
  autor: string;
  texto: string;
  fecha?: Date;
}

/**
 * Se define la interfaz Pet que representa el Modelo en el patrón MVVM.
 * Cumple con el principio de abstracción de datos.
 * Principio de Responsabilidad Única (SRP).
 */
export interface Pet {
  id?: string;
  nombre: string;
  especie: string;
  edad?: string;
  estado: string; // O el tipo de tu enum PetStatus
  fotoUrl: string;
  descripcion?: string; // Asegúrate de incluir esta propiedad como opcional
  comentarios?: any[];
}

export enum PetStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_PROCESO = 'EN_PROCESO',
  ADOPTADO = 'ADOPTADO',
  EXTRAVIADO = 'EXTRAVIADO', // Reemplazado de PERDIDO a EXTRAVIADO
  HALLADO = 'HALLADO'        // Reemplazado de RECONECTADO a HALLADO
}