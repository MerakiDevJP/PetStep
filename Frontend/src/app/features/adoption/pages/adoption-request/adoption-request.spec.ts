import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  adultValidator
} from '../../validators/adult.validator';

@Component({
  selector: 'app-adoption-request',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './adoption-request.html',

  styleUrl: './adoption-request.scss',
})

export class AdoptionRequest {

  adoptionForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {

    this.adoptionForm =
      this.fb.group({

        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        age: [
          '',
          [
            Validators.required,
            adultValidator
          ]
        ],

        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[0-9]{10}$'
            )
          ]
        ],

        reason: [
          '',
          [
            Validators.required,
            Validators.minLength(20)
          ]
        ]

      });

  }

  submitForm() {

    if (
      this.adoptionForm.invalid
    ) {

      this.adoptionForm.markAllAsTouched();

      return;

    }

    console.log(
      this.adoptionForm.value
    );

    alert(
      'Solicitud enviada'
    );

  }

}