import { NotificacionService } from './../../../../services/notificacion/notificacion.service';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { IRecibosList, IRecibos, MESES, IRecibosRegister, IRecibosUpdate } from 'src/app/models/IRecibos.model';
import { ITiposRecibo } from 'src/app/models/ITiposRecibo.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { FormRecibosFileComponent } from '../form-recibos-file/form-recibos-file.component';
import { FormRecibosComponent } from '../form-recibos/form-recibos.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-recibos',
  templateUrl: './lista-recibos.component.html',
  styleUrls: ['./lista-recibos.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ListaRecibosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<IRecibosList>[] = [
    { label: 'Id', property: 'idRecibo', type: 'text', visible: false },
    { label: 'Tipo Recibo', property: 'tipoRecibo', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Mes', property: 'mesReciboDsc', type: 'badge', visible: true, cssClasses: ['font-medium'] },
    { label: 'Dirección', property: 'direccionRecibo', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Consumo Unitario', property: 'consumoUnitario', type: 'number', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Importe', property: 'importe', type: 'number', visible: true, cssClasses: ['text-secondary'] },
    { label: 'PDF', property: 'urlArchivo', type: 'url', visible: true },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<IRecibosList> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  recibos: IRecibosList[] = [];
  tiposRecibos: ITiposRecibo[] = [];
  titulo: string = 'Recibos';
  breadcrumbsList: string[] = ['Mantenimiento', 'Recibos'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_RECIBOS: string = '750px';
  readonly SIZE_DIALOG_FORM_RECIBOS_FILE: string = '950px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRecibos();
    this.getTiposRecibos();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getRecibos(): void {
    this.loading = true;
    this.textTable = 'Cargando información';
    this.subList = this.mantenimientoService.obtenerRecibos().subscribe({
      next: (res) => {
        this.loading = false;
        this.recibos = this.flatMapRecibos(res.data);
        this.dataSource.data = this.recibos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.recibos.length === 0) {
          this.textTable = 'No hay recibos por mostrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.recibos = [];
        this.textTable = 'No hay recibos por mostrar.';
        console.error({ err });
      }
    });
  }

  flatMapRecibos(data: IRecibos[]): IRecibosList[] {
    return data.map((r: IRecibos) => {
      let reciboItem: IRecibosList = {} as IRecibosList;
      reciboItem.idRecibo = r.idRecibo;
      reciboItem.idTipoRecibo = r.tipoRecibo.idTipoRecibo;
      reciboItem.tipoRecibo = r.tipoRecibo.tipoRecibo;
      reciboItem.descripcion = r.tipoRecibo.descripcion;
      reciboItem.urlArchivo = r.urlArchivo;
      reciboItem.mesRecibo = r.mesRecibo - 1;
      reciboItem.mesReciboDsc = MESES[r.mesRecibo - 1];
      reciboItem.direccionRecibo = r.direccionRecibo;
      reciboItem.consumoUnitario = r.consumoUnitario;
      reciboItem.importe = r.importe;
      reciboItem.fechaRegistro = r.fechaRegistro;
      reciboItem.fechaActualizacion = r.fechaActualizacion;
      return reciboItem;
    });
  }

  getTiposRecibos(): void {
    this.subList = this.mantenimientoService.obtenerTiposRecibo().subscribe({
      next: (res) => {
        this.tiposRecibos = res.data;
      },
      error: (err: HttpErrorResponse) => {
        console.error({ err });
      }
    });
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }

    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
    this.textTable = '';

    if (this.dataSource.filteredData.length === 0) {
      this.textTable = 'No hay recibos por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarRecibo(): void {
    const d = this.dialog.open(FormRecibosComponent, {
      data: { recibo: null, tiposRecibo: this.tiposRecibos },
      width: this.SIZE_DIALOG_FORM_RECIBOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (recibo: IRecibosRegister) => {
        if (recibo) {
          // FIXME: REVISAR FUNCIONALIDAD DE REGISTRO DE RECIBO CON FILE PDF
          let reciboRegister = JSON.stringify({
            idTipoRecibo: recibo.idTipoRecibo,
            mesRecibo: recibo.mesRecibo,
            direccionRecibo: recibo.direccionRecibo,
            consumoUnitario: recibo.consumoUnitario,
            importe: recibo.importe
          });
          let body = { crearReciboDTO: reciboRegister, file: recibo.file };

          this.loading = true;
          this.subList = this.mantenimientoService.registrarRecibo(body).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Recibo creado correctamente.', 'SUCCESS');
              this.getRecibos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el recibo. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarRecibo(recibo: IRecibos): void {
    const d = this.dialog.open(FormRecibosComponent, {
      data: { recibo, tiposRecibo: this.tiposRecibos },
      width: this.SIZE_DIALOG_FORM_RECIBOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedRecibo: IRecibosUpdate) => {
        if (updatedRecibo) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarRecibo(updatedRecibo.idRecibo.toString(), updatedRecibo).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificacionService.showMessage(res.message ? res.message : 'Recibo actualizado correctamente.', 'SUCCESS');
              this.getRecibos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del recibo. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  verArchivoPDF(recibo: IRecibosList): void {
    console.log(recibo.urlArchivo);
  }

  actualizarArchivoRecibo(recibo: IRecibos): void {
    const d = this.dialog.open(FormRecibosFileComponent, {
      data: { recibo },
      width: this.SIZE_DIALOG_FORM_RECIBOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedFileRecibo: File) => {

        // FIXME: REVISAR FUNCIONALIDAD DE ACTUALIZACIÓN DE FILE PDF DE RECIBO

        if (updatedFileRecibo) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarFileRecibo(recibo.idRecibo, updatedFileRecibo).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificacionService.showMessage(res.message ? res.message : 'PDF de recibo actualizado correctamente.', 'SUCCESS');
              this.getRecibos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar el PDF del recibo. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  matDialogExtraSmallSub(d: any): Subscription {
    return this.isExtraSmall.subscribe(
      size => {
        if (size.matches) {
          d.updateSize('100vw', '100vh');
        } else {
          d.updateSize(this.SIZE_DIALOG_FORM_RECIBOS, '');
        }
      });
  }
}
