/**
 * Se define la interfaz para estructurar los valores estratégicos de la organización.
 * Cumple con el principio de abstracción y tipado fuerte.
 */
export interface About {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string; // Clase de FontAwesome o Bootstrap Icons
}