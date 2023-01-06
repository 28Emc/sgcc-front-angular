import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInquilinosList } from 'src/app/models/IInquilinos.model';
import { IRoles } from 'src/app/models/IRoles.model';

@Component({
  selector: 'vex-form-inquilinos',
  templateUrl: './form-inquilinos.component.html',
  styleUrls: ['./form-inquilinos.component.scss']
})
export class FormInquilinosComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Crear nuevo inquilino';
  arrTiposDocumento: any[] = [];
  arrGeneros: any[] = [];
  rolInquilino: IRoles = null;
  arrEstados: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormInquilinosComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (!this.data) {
      this.dialogRef.close();
    }

    this.setParametros(this.data);

    if (this.data.inquilino) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar inquilino';
      this.form = this.fb.group({
        idInquilino: [this.data.inquilino.idInquilino, [Validators.required]],
        idUsuario: [this.data.inquilino.idUsuario, [Validators.required]],
        nombres: [this.data.inquilino.nombres, [Validators.required]],
        apellidoPaterno: [this.data.inquilino.apellidoPaterno, [Validators.required]],
        apellidoMaterno: [this.data.inquilino.apellidoMaterno, [Validators.required]],
        tipoDocumento: [this.data.inquilino.tipoDocumento, [Validators.required]],
        nroDocumento: [this.data.inquilino.nroDocumento, [Validators.required]],
        genero: [this.data.inquilino.genero, [Validators.required]],
        telefono: [this.data.inquilino.telefono, [Validators.required]],
        direccion: [this.data.inquilino.direccion, [Validators.required]],
        email: [this.data.inquilino.email, [Validators.required, Validators.email]],
        usuario: [this.data.inquilino.usuario, [Validators.required]],
        password: [this.data.inquilino.password, [Validators.required]],
        idRol: [this.data.inquilino.idRol, [Validators.required]],
        estado: [this.data.inquilino.estado, [Validators.required]],
        fechaInicioContrato: [this.formatInputDate(this.data.inquilino.fechaInicioContrato), [Validators.required]],
        fechaFinContrato: [this.data.inquilino.fechaFinContrato ? this.formatInputDate(this.data.inquilino.fechaInicioContrato) : null]
      });
    } else {
      this.form = this.fb.group({
        idInquilino: null,
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
        idRol: [this.rolInquilino.id_rol, [Validators.required]],
        estado: ['A', [Validators.required]],
        fechaInicioContrato: ['', [Validators.required]],
        fechaFinContrato: null
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
    this.rolInquilino = data?.rol[0] || 2;
  }

  formatInputDate(date: string): string {
    return new Date(date).toISOString();
  }

  save(): void {
    if (this.mode === 'create') {
      this.createUsuario();
    } else if (this.mode === 'update') {
      this.updateUsuario();
    }
  }

  createUsuario(): void {
    let inquilino: IInquilinosList = this.form.getRawValue();
    this.dialogRef.close(inquilino);
  }

  updateUsuario(): void {
    let inquilino: IInquilinosList = this.form.getRawValue();
    inquilino.fechaInicioContrato = this.formatInputDate(inquilino.fechaInicioContrato);
    this.dialogRef.close(inquilino);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
