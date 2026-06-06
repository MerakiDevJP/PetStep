import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { PetService } from '../../../../core/services/pet';

@Component({
  selector: 'app-pet-register',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pet-register.html',
  styleUrl: './pet-register.scss'
})
export class PetRegister {
  petForm: FormGroup;
  submitted = false;
  submitSuccess = false;

  especieOptions = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];
  estadoOptions = ['DISPONIBLE', 'RECONECTADO', 'EN_PROCESO', 'RESERVADO'];

  constructor(private fb: FormBuilder) {
    this.petForm = this.fb.group({
      nombre:        ['', [Validators.required, Validators.minLength(2)]],
      especie:       ['', Validators.required],
      estado:        ['DISPONIBLE', Validators.required],
      fotoUrl:       ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      historia:      ['', [Validators.required, Validators.minLength(20)]],
      salud:         ['', [Validators.required, Validators.minLength(10)]],
      temperamento:  ['', [Validators.required, Validators.minLength(10)]],
      comentarios:   this.fb.array([])
    });
  }

  get f() { return this.petForm.controls; }
  get comentarios() { return this.petForm.get('comentarios') as FormArray; }

  addComentario() {
    this.comentarios.push(this.fb.group({
      autor: ['', Validators.required],
      texto: ['', [Validators.required, Validators.minLength(5)]]
    }));
  }

  removeComentario(i: number) { this.comentarios.removeAt(i); }

  isInvalid(field: string): boolean {
    const c = this.f[field];
    return !!(c && c.invalid && (c.dirty || c.touched || this.submitted));
  }

  isValid(field: string): boolean {
    const c = this.f[field];
    return !!(c && c.valid && (c.dirty || c.touched));
  }

  isCommentInvalid(i: number, field: string): boolean {
    const c = this.comentarios.at(i).get(field);
    return !!(c && c.invalid && (c.dirty || c.touched || this.submitted));
  }

  getError(field: string): string {
    const ctrl = this.f[field];
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])   return 'Este campo es obligatorio.';
    if (ctrl.errors['minlength'])  return `Mínimo ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    if (ctrl.errors['pattern'])    return 'Ingresa una URL válida (https://...).';
    return 'Campo inválido.';
  }

  submitForm() {
    this.submitted = true;
    this.petForm.markAllAsTouched();
    if (this.petForm.invalid) return;

    const payload = {
      ...this.petForm.value,
      comentarios: this.comentarios.controls.map((c, idx) => ({
        _id: `temp_${Date.now()}_${idx}`,
        autor: c.get('autor')?.value,
        texto: c.get('texto')?.value,
        fecha: new Date().toISOString()
      }))
    };
    console.log('Nueva mascota:', payload);

    this.submitSuccess = true;
    setTimeout(() => {
      this.submitSuccess = false;
      this.submitted = false;
      this.petForm.reset({ estado: 'DISPONIBLE' });
      while (this.comentarios.length) this.comentarios.removeAt(0);
    }, 4000);
  }
}