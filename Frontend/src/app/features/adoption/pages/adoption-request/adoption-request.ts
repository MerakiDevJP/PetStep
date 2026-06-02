import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
FormBuilder,
FormGroup,
ReactiveFormsModule,
Validators
}
from '@angular/forms';

import {
adultValidator
}
from '../../validators/adult.validator';

@Component({

selector:
'app-adoption-request',

standalone:true,

imports:[
CommonModule,
ReactiveFormsModule
],

templateUrl:
'./adoption-request.html',

styleUrl:
'./adoption-request.scss'

})

export class AdoptionRequest{

adoptionForm:
FormGroup;

constructor(
private fb:
FormBuilder
){

this.adoptionForm=
this.fb.group({

fullName:[
'',
[
Validators.required
]
],

email:[
'',
[
Validators.required,
Validators.email
]
],

age:[
'',
[
adultValidator
]
]

});

}

submitForm(){

console.log(
this.adoptionForm.value
);

}

}