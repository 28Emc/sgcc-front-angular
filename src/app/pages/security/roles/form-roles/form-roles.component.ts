import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRoles, Roles } from 'src/app/models/IRoles.model';

@Component({
  selector: 'vex-form-roles',
  templateUrl: './form-roles.component.html',
  styleUrls: ['./form-roles.component.scss']
})
export class FormRolesComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Registrar nuevo rol';

  constructor(
    @Inject(MAT_DIALOG_DATA) public rol: IRoles,
    private dialogRef: MatDialogRef<FormRolesComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.rol) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar rol';
      this.form = this.fb.group({
        idRol: [this.rol.id_rol, [Validators.required]],
        rol: [this.rol.rol, [Validators.required]],
        descripcion: [this.rol.descripcion],
        ruta: [this.rol.ruta]
      });
    } else {
      this.rol = new Roles();
      this.form = this.fb.group({
        idRol: [null],
        rol: ['', [Validators.required]],
        descripcion: [''],
        ruta: ['']
      });
    }
  }

  save() {
    if (this.mode === 'create') {
      this.createRol();
    } else if (this.mode === 'update') {
      this.updateRol();
    }
  }

  createRol() {
    const rol: IRoles = this.form.getRawValue();

    if (!rol.ruta) {
      rol.ruta = '/';
    }

    this.dialogRef.close(rol);
  }

  updateRol() {
    const rol: IRoles = this.form.getRawValue();
    this.dialogRef.close(rol);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
