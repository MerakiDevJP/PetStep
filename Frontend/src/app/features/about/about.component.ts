import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { About } from '../../core/models/about.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  public valorSeleccionadoId = signal<string | null>(null);
  
  // Signal reactivo para controlar el renderizado de la imagen en el DOM asíncrono
  public imagenActualUrl = signal<string | null>(null);

  // Registro indexado e inmutable para las imágenes institucionales
  private readonly imagenesEstrategicas: { [key: string]: string } = {
    mision: 'assets/images/mision-petstep.png', 
    vision: 'assets/images/vision-petstep.png'
  };

  public readonly mision = signal<string>(
    'Automatizar y optimizar los procesos de adopción y monitoreo post-adopción de fauna urbana mediante una plataforma web robusta e intuitiva basada en el stack MEAN. El sistema garantiza la trazabilidad absoluta de cada mascota a través de flujos de estado estrictos y arquitecturas reactivas, mitigando la fragmentación de la información y promoviendo el bienestar animal.'
  );

  public readonly vision = signal<string>(
    'Consolidarse para el año 2028 como la solución tecnológica de referencia en la gestión de protección animal a nivel regional, reconocida por su excelencia en arquitectura de software, innovación en interfaces de usuario (UI/UX) y confiabilidad de datos.'
  );

  public readonly valores = signal<About[]>([
    {
      id: 'v1',
      titulo: 'Integridad y Rigor Técnico',
      descripcion: 'Se prioriza la excelencia en la ingeniería de software mediante la aplicación estricta de principios SOLID y patrones de diseño.',
      icono: 'bi-code-slash'
    },
    {
      id: 'v2',
      titulo: 'Innovación Centrada en el Usuario',
      descripcion: 'La implementación de interfaces dinámicas busca ofrecer una experiencia de usuario óptima que potencie las tasas de adopción.',
      icono: 'bi-cpu'
    },
    {
      id: 'v3',
      titulo: 'Responsabilidad Social',
      descripcion: 'Compromiso ético con la entrega de un sistema eficiente que optimice los recursos digitales del refugio y asegure el bienestar animal.',
      icono: 'bi-heart-pulse'
    }
  ]);

  /**
   * CÓDIGO DEL EVENTO: Asigna de forma reactiva la URL según la sección activa.
   */
  public onMostrarImagen(seccion: 'mision' | 'vision'): void {
    this.imagenActualUrl.set(this.imagenesEstrategicas[seccion]);
  }

  /**
   * CÓDIGO DEL EVENTO: Remueve la URL del estado destruyendo el nodo del DOM.
   */
  public onOcultarImagen(): void {
    this.imagenActualUrl.set(null);
  }

  public onSeleccionarValor(id: string): void {
    if (this.valorSeleccionadoId() === id) {
      this.valorSeleccionadoId.set(null);
    } else {
      this.valorSeleccionadoId.set(id);
    }
  }
}