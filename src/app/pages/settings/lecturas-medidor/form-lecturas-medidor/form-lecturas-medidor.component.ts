import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ILecturaRegister, ILecturaUpdate } from 'src/app/models/ILecturas.model';

@Component({
  selector: 'vex-form-lecturas-medidor',
  templateUrl: './form-lecturas-medidor.component.html',
  styleUrls: ['./form-lecturas-medidor.component.scss']
})
export class FormLecturasMedidorComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Crear nueva lectura';
  arrRecibos: any[] = [];
  arrInquilinos: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormLecturasMedidorComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setParametros(this.data);

    if (this.data.lectura) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar lectura';
      this.form = this.fb.group({
        idLectura: [this.data.lectura.idLectura, [Validators.required]],
        idConsumo: [this.data.lectura.idConsumo, [Validators.required]],
        idRecibo: [this.data.lectura.idRecibo, [Validators.required]],
        idInquilino: [this.data.lectura.idInquilino, [Validators.required]],
        lecturaMedidorAnterior: [this.data.lectura.lecturaMedidorAnterior, [Validators.required]],
        lecturaMedidorActual: [this.data.lectura.lecturaMedidorActual, [Validators.required]]
      });
      console.log(this.form.getRawValue());
    } else {
      this.form = this.fb.group({
        idRecibo: null,
        idInquilino: ['', [Validators.required]],
        lecturaMedidorActual: ['', [Validators.required]]
      });
    }
  }

  setParametros(data: any): void {
    this.arrRecibos = data.recibos;
    this.arrInquilinos = data.inquilinos;
  }

  save(): void {
    if (this.mode === 'create') {
      this.createLectura();
    } else if (this.mode === 'update') {
      this.updateLectura();
    }
  }

  createLectura(): void {
    let lectura: ILecturaRegister = this.form.getRawValue();
    this.dialogRef.close(lectura);
  }

  updateLectura(): void {
    let lectura: ILecturaUpdate = this.form.getRawValue();
    this.dialogRef.close(lectura);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
