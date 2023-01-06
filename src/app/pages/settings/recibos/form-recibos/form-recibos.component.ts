import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESES, IRecibosRegister, IRecibosUpdate } from 'src/app/models/IRecibos.model';

@Component({
  selector: 'vex-form-recibos',
  templateUrl: './form-recibos.component.html',
  styleUrls: ['./form-recibos.component.scss']
})
export class FormRecibosComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Crear nuevo recibo';
  arrTiposRecibo: any[] = [];
  arrMeses: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormRecibosComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setParametros(this.data);

    if (this.data.recibo) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar recibo';
      this.form = this.fb.group({
        idRecibo: [this.data.recibo.idRecibo, [Validators.required]],
        idTipoRecibo: [this.data.recibo.idTipoRecibo, [Validators.required]],
        mesRecibo: [this.data.recibo.mesRecibo, [Validators.required]],
        consumoUnitario: [this.data.recibo.consumoUnitario, [Validators.required]],
        importe: [this.data.recibo.importe, [Validators.required]],
        urlArchivo: [this.data.recibo.urlArchivo, [Validators.required]],
        direccionRecibo: [this.data.recibo.direccionRecibo, [Validators.required]]
      });
      console.log(this.form.getRawValue());
    } else {
      this.form = this.fb.group({
        idRecibo: null,
        idTipoRecibo: ['', [Validators.required]],
        mesRecibo: ['', [Validators.required]],
        consumoUnitario: [0.00, [Validators.required]],
        importe: [0.00, [Validators.required]],
        direccionRecibo: ['', [Validators.required]],
        file: []
      });
    }
  }

  setParametros(data: any): void {
    this.arrMeses = this.enumToArray(MESES);
    this.arrTiposRecibo = data.tiposRecibo;
  }

  enumToArray<T>(enumeration: T, separatorRegex: RegExp = /_/g): any[] {
    return (Object.keys(enumeration) as Array<keyof T>)
      .filter(key => isNaN(Number(key)))
      .filter(key => typeof enumeration[key] === "number" || typeof enumeration[key] === "string")
      .map(key => ({
        id: enumeration[key],
        mes: String(key).replace(separatorRegex, ' '),
      }));
  }

  save(): void {
    if (this.mode === 'create') {
      this.createRecibo();
    } else if (this.mode === 'update') {
      this.updateRecibo();
    }
  }

  createRecibo(): void {
    let recibo: IRecibosRegister = this.form.getRawValue();
    recibo.mesRecibo = recibo.mesRecibo + 1;
    recibo.file = new File([], 'recibo-prueba.pdf'); // FIXME: REVISAR FUNCIONALIDAD DE REGISTRO DE RECIBO CON FILE PDF
    this.dialogRef.close(recibo);
  }

  updateRecibo(): void {
    let recibo: IRecibosUpdate = this.form.getRawValue();
    recibo.mesRecibo = recibo.mesRecibo + 1;
    this.dialogRef.close(recibo);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
