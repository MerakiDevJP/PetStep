import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PetGalleryComponent } from './features/pet-gallery/pet-gallery.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PetGalleryComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('pet-step-ui');
}
