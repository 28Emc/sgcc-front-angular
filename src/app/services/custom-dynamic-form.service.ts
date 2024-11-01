import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFieldConfig } from '../interfaces/IFieldConfig.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomDynamicFormService {
  constructor(
    private readonly fb: FormBuilder
  ) { }

  createForm(fieldsConfig: IFieldConfig[]): FormGroup {
    const form = this.fb.group({});
    fieldsConfig.forEach(field => {
      const control = this.fb.control(
        { value: field.value, disabled: field.disabled || false },
        field.validators || []
      );
      form.addControl(field.name, control);
    });
    return form;
  }
}
