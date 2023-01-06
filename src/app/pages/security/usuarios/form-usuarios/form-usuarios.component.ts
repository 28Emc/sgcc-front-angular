import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRoles } from 'src/app/models/IRoles.model';

@Component({
  selector: 'vex-form-usuarios',
  templateUrl: './form-usuarios.component.html',
  styleUrls: ['./form-usuarios.component.scss']
})
export class FormUsuariosComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Crear nuevo usuario';
  arrTiposDocumento: any[] = [];
  arrGeneros: any[] = [];
  arrRoles: IRoles[] = [];
  arrEstados: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormUsuariosComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setParametros(this.data);

    if (this.data.usuario) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar usuario';
      this.form = this.fb.group({
        idUsuario: [this.data.usuario.idUsuario, [Validators.required]],
        nombres: [this.data.usuario.nombres, [Validators.required]],
        apellidoPaterno: [this.data.usuario.apellidoPaterno, [Validators.required]],
        apellidoMaterno: [this.data.usuario.apellidoMaterno, [Validators.required]],
        tipoDocumento: [this.data.usuario.tipoDocumento, [Validators.required]],
        nroDocumento: [this.data.usuario.nroDocumento, [Validators.required]],
        genero: [this.data.usuario.genero, [Validators.required]],
        telefono: [this.data.usuario.telefono, [Validators.required]],
        direccion: [this.data.usuario.direccion, [Validators.required]],
        email: [this.data.usuario.email, [Validators.required, Validators.email]],
        usuario: [this.data.usuario.usuario, [Validators.required]],
        password: [this.data.usuario.password, [Validators.required]],
        idRol: [this.data.usuario.idRol, [Validators.required]],
        estado: [this.data.usuario.estado, [Validators.required]]
      });
    } else {
      this.form = this.fb.group({
        idUsuario: null,
        nombres: ['', [Validators.required]],
        apellidoPaterno: ['', [Validators.required]],
        apellidoMaterno: ['', [Validators.required]],
        tipoDocumento: ['', [Validators.required]],
        nroDocumento: ['', [Validators.required]],
        genero: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        usuario: ['', [Validators.required]],
        password: ['', [Validators.required]],
        idRol: ['', [Validators.required]],
        estado: ['A', [Validators.required]]
      });
    }
  }

  setParametros(data: any): void {
    this.arrTiposDocumento = [
      { valor: 'DNI', descripcion: 'DNI' },
      { valor: 'RUC', descripcion: 'RUC' },
      { valor: 'CE', descripcion: 'CARNET DE EXTRANJERÍA' }
    ];
    this.arrGeneros = [
      { valor: 'M', descripcion: 'MASCULINO' },
      { valor: 'F', descripcion: 'FEMENINO' },
      { valor: 'N', descripcion: 'OTRO' }
    ];
    this.arrEstados = [
      { valor: 'A', descripcion: 'ACTIVO' },
      { valor: 'B', descripcion: 'INACTIVO' }
    ];
    this.arrRoles = data.roles;
  }

  save(): void {
    if (this.mode === 'create') {
      this.createUsuario();
    } else if (this.mode === 'update') {
      this.updateUsuario();
    }
  }

  createUsuario(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  updateUsuario(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
