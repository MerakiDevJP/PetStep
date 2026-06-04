import { AbstractControl, ValidationErrors } from '@angular/forms';

export function adultValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value && control.value !== 0) return null;
  const age = Number(control.value);
  if (isNaN(age)) return { adult: true };
  return age >= 18 ? null : { adult: true };
}