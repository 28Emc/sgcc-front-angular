import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { IComponentes, Componentes } from 'src/app/models/IComponentes.model';

@Component({
  selector: 'vex-form-componentes',
  templateUrl: './form-componentes.component.html',
  styleUrls: ['./form-componentes.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class FormComponentesComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  tituloForm: string = 'Registrar nuevo componente';
  componente: IComponentes;
  componentesPadre: IComponentes[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormComponentesComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.componente = this.data.componente;
    this.componentesPadre = this.data.componentesPadre.filter(c => c.idComponentePadre === 0);

    if (this.componente) {
      this.mode = 'update';
      this.tituloForm = 'Actualizar componente';
      this.form = this.fb.group({
        idComponente: [this.componente.idComponente, [Validators.required]],
        isComponentePadre: [this.componente.idComponentePadre === 0, [Validators.required]],
        idComponentePadre: [this.componente.idComponentePadre, [Validators.required]],
        componente: [this.componente.componente, [Validators.required]],
        descripcion: [this.componente.descripcion],
        icono: [this.componente.icono],
        ruta: [this.componente.ruta],
        orden: [this.componente.orden],
        estado: [this.componente.estado]
      });
    } else {
      this.componente = new Componentes();
      this.form = this.fb.group({
        isComponente: [null],
        isComponentePadre: [true, [Validators.required]],
        idComponentePadre: [0, [Validators.required]],
        componente: ['', [Validators.required]],
        descripcion: [''],
        icono: ['', [Validators.required]],
        ruta: ['', [Validators.required]],
        orden: ['', [Validators.required]],
        estado: ['B']
      });
    }
  }

  changeComponentePadre(id: number): void {
    console.log('id', id);
    /* let compPadre = this.data.componentesPadre.filter(c => c.idComponente == id);
    let lastOrden = this.data.componentesPadre.reduce((prev, curr) => (prev.orden > curr.orden) ? prev : curr);
    this.form.get('icono').setValue(compPadre[0].icono);
    this.form.get('ruta').setValue(compPadre[0].ruta.concat('/'));
    this.form.get('orden').setValue(lastOrden.orden + 1); */
  }

  showHideComponentesPadre(): boolean {
    let checked: boolean = this.form.get('isComponentePadre').value;
    /* this.form.get('icono').disable();
    this.form.get('orden').disable(); */

    if (checked === true) {
      this.form.get('idComponentePadre').setValue(0);
      /* this.form.get('icono').enable();
      this.form.get('icono').setValue('');
      this.form.get('orden').enable();
      this.form.get('orden').setValue('');
      this.form.get('ruta').setValue(''); */
    }

    return !checked;
  }

  save(): void {
    if (this.mode === 'create') {
      this.createRol();
    } else if (this.mode === 'update') {
      this.updateRol();
    }
  }

  createRol(): void {
    const componente: IComponentes = this.form.getRawValue();
    this.dialogRef.close(componente);
  }

  updateRol(): void {
    const componente: IComponentes = this.form.getRawValue();
    this.dialogRef.close(componente);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
