import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // <-- NUEVA IMPORTACIÓN
import { PetRegister } from '../pet-register/pet-register';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { adultValidator } from '../../validators/adult.validator';
import { PetService } from '../../../../core/services/pet.service';

type FormMode = 'adoption' | 'lost';

@Component({
  selector: 'app-adoption-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PetRegister],
  templateUrl: './adoption-request.html',
  styleUrl: './adoption-request.scss'
})
export class AdoptionRequest implements OnInit {
  adoptionForm: FormGroup;
  submitted = false;
  submitSuccess = false;
  private currentPetId: string | null = null; // <-- Variable para guardar el ID real

  // <-- Inyectamos ActivatedRoute en el constructor
  constructor(
    private fb: FormBuilder, 
    private petService: PetService,
    private route: ActivatedRoute 
  ) {
    this.adoptionForm = this.fb.group({
      formMode: ['adoption', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-]{7,15}$/)]],
      age: ['', [Validators.required, adultValidator]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      petName: ['', Validators.required],
      petDescription: ['', [Validators.required, Validators.minLength(20)]],
      fotoUrl: [''], 
      message: ['']
    });
  }

  ngOnInit(): void { 
    // Captura el parámetro 'petId' directamente de la URL al inicializar el componente
    this.currentPetId = this.route.snapshot.queryParamMap.get('petId');
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
    return !!(control && control.invalid && (control.dirty || control.touched || this.submitted));
  }

  isValid(field: string): boolean {
    const control = this.f[field];
    return !!(control && control.valid && (control.dirty || control.touched));
  }

  getError(field: string): string {
    const ctrl = this.f[field];
    if (!ctrl || !ctrl.errors) return '';

    if (ctrl.errors['required']) return 'Este campo es obligatorio.';
    if (ctrl.errors['email']) return 'Ingresa un correo electrónico válido.';
    if (ctrl.errors['adult']) return 'Debes ser mayor de 18 años para continuar.';
    if (ctrl.errors['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres requeridos.`;
    }
    if (ctrl.errors['pattern']) {
      if (field === 'phone') return 'Número de teléfono no válido.';
      return 'Formato inválido.';
    }
    return 'Campo inválido.';
  }

  submitForm(): void {
    this.submitted = true;
    this.adoptionForm.markAllAsTouched();

    if (this.adoptionForm.invalid) return;

    const rawValues = this.adoptionForm.value;

    const payload = {
      formMode: rawValues.formMode,
      fullName: rawValues.fullName,
      email: rawValues.email,
      phone: rawValues.phone,
      age: rawValues.age,
      address: rawValues.address,
      petName: rawValues.petName,
      petDescription: rawValues.petDescription,
      fotoUrl: rawValues.fotoUrl, 
      message: rawValues.message,
      petId: this.isAdoption ? this.currentPetId : null // <-- CORRECCIÓN: Envía el ID dinámico capturado
    };

    const endpoint = this.isAdoption 
      ? 'http://localhost:3000/api/adoptions' 
      : 'http://localhost:3000/api/lost-reports';

    console.log(`Disparando petición hacia: ${endpoint}`, payload);

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Error en el servidor');
        const data = await res.json();
        console.log('¡Transacción exitosa!', data);

        this.submitSuccess = true;
        setTimeout(() => {
          this.submitSuccess = false;
          this.submitted = false;
          this.adoptionForm.reset({ formMode: 'adoption' });
        }, 4000);
      })
      .catch((err) => {
        console.error('Error al conectar con la API:', err);
        alert('Hubo un error al procesar la solicitud en el servidor.');
      });
  }
}