

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
  _id?: string;      // ID nativo generado de forma automática por MongoDB/Mongoose
  id: string;
  nombre: string;
  especie: string;
  estado: PetStatus; // Uso de Enums para evitar datos no válidos
  fotoUrl: string;
  edad?: string;       // Edad opcional para mayor flexibilida
  comentarios?: Comment[]; // Extensión del modelo para soportar la visualización de la BD
}

export enum PetStatus {
  DISPONIBLE = 'DISPONIBLE',
  EN_PROCESO = 'EN_PROCESO',
  ADOPTADO = 'ADOPTADO',
  PERDIDO = 'PERDIDO',
  RECONECTADO = 'RECONECTADO'
}