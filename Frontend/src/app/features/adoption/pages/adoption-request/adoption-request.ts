import { Component, OnInit, inject } from '@angular/core'; // se adiciona inject para inyectar el servicio ActivatedRoute
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { adultValidator } from '../../validators/adult.validator';
import { PetService } from '../../../../core/services/pet.service';// Importamos el servicio para obtener datos de mascotas


type FormMode = 'adoption' | 'lost';

@Component({
  selector: 'app-adoption-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adoption-request.html',
  styleUrl: './adoption-request.scss'
})
export class AdoptionRequest implements OnInit {
  // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
  private readonly _route = inject(ActivatedRoute);
  private readonly _petService = inject(PetService);

  adoptionForm: FormGroup;
  submitted = false;

  // Controladores de estado dinámicos para las alertas de interfaz
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  isSubmitting = false; // Evita que se envíe el formulario múltiples veces por clics accidentales

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.adoptionForm = this.fb.group({
      formMode: ['adoption', Validators.required],
      mascotaId: [''],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-]{7,15}$/)]],
      age: ['', [Validators.required, adultValidator]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      petName: ['', Validators.required],
      petPhotoUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      petDescription: ['', [Validators.required, Validators.minLength(20)]],
      message: ['']
    });
  }

  ngOnInit(): void {
    // Se leen los parámetros de la URL al cargar el componente
    const tipo = this.route.snapshot.queryParamMap.get('tipo');
    const mascota = this.route.snapshot.queryParamMap.get('mascota');
    const mascotaId = this.route.snapshot.queryParamMap.get('mascotaId');

    console.log('QueryParam - Tipo:', tipo);
    console.log('QueryParam - Mascota:', mascota);
    console.log('QueryParam - MascotaId:', mascotaId);

    if (tipo) {
      // El parámetro de la tarjeta es 'extraviado', cambia automáticamente a 'lost'
      const modoForm: FormMode = tipo === 'extraviado' ? 'lost' : 'adoption';
      this.adoptionForm.patchValue({ formMode: modoForm });
    }

    if (mascota) {
      this.adoptionForm.patchValue({ petName: mascota });
      // Opcional: Si viene predefinida por una PetCard, bloqueamos el input para evitar desajustes
      if (tipo !== 'extraviado') {
        this.adoptionForm.get('petName')?.disable();
      }
    }

    if (mascotaId) {
      this.adoptionForm.patchValue({ mascotaId: mascotaId });
    }

    // Lógica interna de validación dinámica para el campo de foto según el modo del formulario  
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
    this.submitError = false; // Limpiamos alertas de errores de intentos previos
    this.adoptionForm.markAllAsTouched();

    if (this.adoptionForm.invalid) return;

    this.isSubmitting = true; 
     
    // Uso de getRawValue para extraer todo del body
    const datosFormulario = this.adoptionForm.getRawValue();

    // Estructuración exacta con la nomenclatura relacional y tipados que pide Express / MongoDB
    const payloadParaBackend = {
      tipoFormulario: datosFormulario.formMode,
      nombreSolicitante: datosFormulario.fullName,
      emailContacto: datosFormulario.email,
      telefonoContacto: datosFormulario.phone,
      edadSolicitante: datosFormulario.age,
      direccionDomicilio: datosFormulario.address,
      mascotaId: datosFormulario.petId || null,
      nombreMascota: datosFormulario.petName,
      urlFotoMascota: datosFormulario.petPhotoUrl || null,
      descripcionMotivos: datosFormulario.petDescription,
      mensajeAdicional: datosFormulario.message || ''
    };

    console.log('Desplegando petición HttpClient al Backend con Payload:', payloadParaBackend);
    //console.log('Formulario enviado:', this.adoptionForm.value);
    
    // Llamada usando el método unificado del PetService fusionado
    this._petService.enviarSolicitudAdopcion(payloadParaBackend).subscribe({
      next: (respuesta) => {
        console.log('¡Petición guardada exitosamente en MongoDB!', respuesta);
        this.submitSuccess = true;
        this.isSubmitting = false;

        setTimeout(() => {
          this.submitSuccess = false;
          this.submitted = false;
          // Reseteamos el formulario devolviendo el estado por defecto y reactivando campos
          this.adoptionForm.reset({ formMode: 'adoption' });
          this.adoptionForm.get('petName')?.enable();
        }, 4000);
      },
      error: (error) => {
        console.error('Fallo de consistencia al conectar con la API de Express:', error);
        this.submitError = true;
        this.isSubmitting = false;
        
        // Extrae el mensaje directo de tu controlador de Node.js si existe, de lo contrario un fallback genérico
        this.errorMessage = error.error?.message || 'Error de conexión. No se pudo establecer contacto con el servidor de PetStep.';
      }
    });
  }
    /*this.submitSuccess = true;

    setTimeout(() => {
      this.submitSuccess = false;
      this.submitted = false;
      this.adoptionForm.reset({ formMode: 'adoption' });
    }, 4000);
  }*/
}