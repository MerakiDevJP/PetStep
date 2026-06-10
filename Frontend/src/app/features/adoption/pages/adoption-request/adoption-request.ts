import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { adultValidator } from '../../validators/adult.validator';

type FormMode = 'adoption' | 'lost';

@Component({
  selector: 'app-adoption-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adoption-request.html',
  styleUrl: './adoption-request.scss'
})
export class AdoptionRequest implements OnInit {
  adoptionForm: FormGroup;
  submitted = false;
  submitSuccess = false;

  constructor(private fb: FormBuilder) {
    this.adoptionForm = this.fb.group({
      formMode: ['adoption', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-]{7,15}$/)]],
      age: ['', [Validators.required, adultValidator]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      petName: ['', Validators.required],

      // NO poner Validators.required aquí
      petPhotoUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],

      petDescription: ['', [Validators.required, Validators.minLength(20)]],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.adoptionForm.get('formMode')?.valueChanges.subscribe(mode => {
      const photoControl = this.adoptionForm.get('petPhotoUrl');

      if (mode === 'lost') {
        photoControl?.setValidators([
          Validators.required,
          Validators.pattern(/^https?:\/\/.+/)
        ]);
      } else {
        photoControl?.setValidators([
          Validators.pattern(/^https?:\/\/.+/)
        ]);
      }

      photoControl?.updateValueAndValidity();
    });
  }

  get f() {
    return this.adoptionForm.controls;
  }

  get currentMode(): FormMode {
    return this.adoptionForm.get('formMode')?.value as FormMode;
  }

  get isAdoption(): boolean {
    return this.currentMode === 'adoption';
  }

  isInvalid(field: string): boolean {
    const control = this.f[field];
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || this.submitted)
    );
  }

  isValid(field: string): boolean {
    const control = this.f[field];
    return !!(
      control &&
      control.valid &&
      (control.dirty || control.touched)
    );
  }

  getError(field: string): string {
    const ctrl = this.f[field];
    if (!ctrl || !ctrl.errors) return '';

    if (ctrl.errors['required']) {
      if (field === 'petPhotoUrl') {
        return 'La foto de la mascota es obligatoria.';
      }
      return 'Este campo es obligatorio.';
    }

    if (ctrl.errors['email']) {
      return 'Ingresa un correo electrónico válido.';
    }

    if (ctrl.errors['adult']) {
      return 'Debes ser mayor de 18 años para continuar.';
    }

    if (ctrl.errors['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres requeridos.`;
    }

    if (ctrl.errors['pattern']) {
      if (field === 'phone') {
        return 'Número de teléfono no válido.';
      }

      if (field === 'petPhotoUrl') {
        return 'Ingresa una URL válida (https://...).';
      }

      return 'Formato inválido.';
    }

    return 'Campo inválido.';
  }

  submitForm(): void {
    this.submitted = true;
    this.adoptionForm.markAllAsTouched();

    if (this.adoptionForm.invalid) return;

    console.log('Formulario enviado:', this.adoptionForm.value);
    this.submitSuccess = true;

    setTimeout(() => {
      this.submitSuccess = false;
      this.submitted = false;
      this.adoptionForm.reset({ formMode: 'adoption' });
    }, 4000);
  }
}