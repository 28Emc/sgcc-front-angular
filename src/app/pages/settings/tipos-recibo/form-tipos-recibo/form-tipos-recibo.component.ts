import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-form-tipos-recibo',
  templateUrl: './form-tipos-recibo.component.html',
  styleUrls: ['./form-tipos-recibo.component.scss']
})
export class FormTiposReciboComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Crear nuevo tipo de recibo';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormTiposReciboComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.data.tipoRecibo) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar tipo de recibo';
      this.form = this.fb.group({
        idTipoRecibo: [this.data.tipoRecibo.idTipoRecibo, [Validators.required]],
        tipoRecibo: [this.data.tipoRecibo.tipoRecibo, [Validators.required]],
        descripcion: [this.data.tipoRecibo.descripcion]
      });
    } else {
      this.form = this.fb.group({
        idTipoRecibo: null,
        tipoRecibo: ['', [Validators.required]],
        descripcion: ['']
      });
    }
  }

  save(): void {
    if (this.mode === 'create') {
      this.createTipoRecibo();
    } else if (this.mode === 'update') {
      this.updateTipoRecibo();
    }
  }

  createTipoRecibo(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  updateTipoRecibo(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
