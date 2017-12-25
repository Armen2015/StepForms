import { AbstractControl } from '@angular/forms';

export function ValidatePass(control: AbstractControl) {
    var value = control.value
  if (!/\d/.test(value) 
      || !/[a-z]/.test(value) 
      || !/[A-Z]/.test(value)
      || !/[#-/:-@{-~!"^_`\[\]]/.test(value)
    ) {
    return { validPass: true };
  }
  return null;
}