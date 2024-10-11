import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(value)) return { invalidPassword: true };
    return null;
  };
}

export function isNumberCheck(minNumber: number, maxNumber: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    let number = /^[.\d]+$/.test(c.value) ? +c.value : NaN;
    if (isNaN(number) || number < minNumber || number > maxNumber) return { 'value': true };
    return null;
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(value)) return { invalidUrl: true };
    return null;
  };
}
