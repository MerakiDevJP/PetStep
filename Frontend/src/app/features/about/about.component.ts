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

  // Rutas explícitas inmutables para las caras frontales de Misión y Visión
  public readonly imgMision = 'assets/images/mision-petstep.png';
  public readonly imgVision = 'assets/images/vision-petstep.png';

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
      icono: 'bi-code-slash',
      imagenUrl: 'assets/images/integridad.png' // 🚀 Ruta de imagen
    },
    {
      id: 'v2',
      titulo: 'Innovación Centrada en el Usuario',
      descripcion: 'La implementación de interfaces dinámicas busca ofrecer una experiencia de usuario óptima que potencie las tasas de adopción.',
      icono: 'bi-cpu',
      imagenUrl: 'assets/images/innovacion.png' // 🚀 Ruta de imagen
    },
    {
      id: 'v3',
      titulo: 'Responsabilidad Social',
      descripcion: 'Compromiso ético con la entrega de un sistema eficiente que optimice los recursos digitales del refugio y asegure el bienestar animal.',
      icono: 'bi-heart-pulse',
      imagenUrl: 'assets/images/responsabilidad.png' // 🚀 Ruta de imagen
    }
  ]);

  public onSeleccionarValor(id: string): void {
    this.valorSeleccionadoId.update(actual => actual === id ? null : id);
  }
}