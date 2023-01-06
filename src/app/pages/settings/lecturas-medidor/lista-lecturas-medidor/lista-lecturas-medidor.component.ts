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
import { IInquilinosList } from 'src/app/models/IInquilinos.model';
import { ILecturasList, ILecturaRegister, ILecturaUpdate } from 'src/app/models/ILecturas.model';
import { IRecibosList, MESES, IRecibos } from 'src/app/models/IRecibos.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { FormLecturasMedidorComponent } from '../form-lecturas-medidor/form-lecturas-medidor.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-lecturas-medidor',
  templateUrl: './lista-lecturas-medidor.component.html',
  styleUrls: ['./lista-lecturas-medidor.component.scss'],
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
export class ListaLecturasMedidorComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<ILecturasList>[] = [
    { label: 'Id', property: 'idLectura', type: 'text', visible: false },
    { label: 'Inquilino', property: 'nombreCompletoInquilino', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Recibo', property: 'recibo', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Mes', property: 'mesReciboDsc', type: 'badge', visible: true, cssClasses: ['font-medium'] },
    { label: 'Lectura Anterior', property: 'lecturaMedidorAnterior', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Lectura Actual', property: 'lecturaMedidorActual', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Consumo Medidor', property: 'consumoMedidor', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Consumo Unitario', property: 'consumoUnitario', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Importe', property: 'importe', type: 'number', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Fecha Registro', property: 'fechaRegistro', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Fecha Actualización', property: 'fechaActualizacion', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<ILecturasList> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  lecturas: ILecturasList[] = [];
  recibos: IRecibosList[] = [];
  inquilinos: IInquilinosList[] = [];
  titulo: string = 'Lecturas';
  breadcrumbsList: string[] = ['Mantenimiento', 'Lecturas'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_LECTURAS: string = '550px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getLecturas();
    this.getRecibos();
    this.getInquilinos();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getLecturas(): void {
    this.loading = true;
    this.textTable = 'Cargando información';
    this.subList = this.mantenimientoService.obtenerLecturas().subscribe({
      next: (res) => {
        this.loading = false;
        this.lecturas = res.data.map(l => {
          let mesReciboReal = l.mesRecibo - 1;
          l.mesRecibo = mesReciboReal;
          l.mesReciboDsc = MESES[mesReciboReal];
          return l;
        });
        this.dataSource.data = this.lecturas;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.lecturas.length === 0) {
          this.textTable = 'No hay lecturas por mostrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.lecturas = [];
        this.textTable = 'No hay lecturas por mostrar.';
        console.error({ err });
      }
    });
  }

  getRecibos(): void {
    this.subList = this.mantenimientoService.obtenerRecibos().subscribe({
      next: (res) => {
        this.recibos = this.mapRecibos(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.recibos = [];
        console.error({ err });
      }
    });
  }

  mapRecibos(data: IRecibos[]): IRecibosList[] {
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

  getInquilinos(): void {
    this.subList = this.mantenimientoService.obtenerInquilinos().subscribe({
      next: (res) => {
        this.inquilinos = this.flatMapInquilinos(res.data);
      },
      error: (err: HttpErrorResponse) => {
        this.inquilinos = [];
        console.error({ err });
      }
    });
  }

  flatMapInquilinos(data: IInquilinosList[]): IInquilinosList[] {
    return data.map((u: IInquilinosList) => {
      u.estadoDsc = u.estado === 'A' ? 'ACTIVO' : 'BAJA';
      u.generoDsc = u.genero === 'M' ? 'MASCULINO' : u.genero === 'F' ? 'FEMENINO' : 'OTRO';
      u.nombreCompleto = u.nombres.concat(', ', u.apellidoPaterno, ' ', u.apellidoMaterno);
      return u;
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
      this.textTable = 'No hay lecturas por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarLectura(): void {
    const d = this.dialog.open(FormLecturasMedidorComponent, {
      data: { lectura: null, recibos: this.recibos, inquilinos: this.inquilinos },
      width: this.SIZE_DIALOG_FORM_LECTURAS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (lectura: ILecturaRegister) => {
        if (lectura) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarLectura(lectura).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Lectura creada correctamente.', 'SUCCESS');
              this.getLecturas();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear la lectura. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarLectura(lectura: ILecturasList): void {
    const d = this.dialog.open(FormLecturasMedidorComponent, {
      data: { lectura, recibos: this.recibos, inquilinos: this.inquilinos },
      width: this.SIZE_DIALOG_FORM_LECTURAS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedLectura: ILecturaUpdate) => {
        if (updatedLectura) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarLectura(updatedLectura.idLectura.toString(), updatedLectura).subscribe({
            next:
              (res: any) => {
                this.loading = false;
                this.notificacionService.showMessage(res.message ? res.message : 'Lectura actualizada correctamente.', 'SUCCESS');
                this.getLecturas();
              },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos de la lectura. Contacte con el administrador.', 'ERROR');
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
          d.updateSize(this.SIZE_DIALOG_FORM_LECTURAS, '');
        }
      });
  }
}
