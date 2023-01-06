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
import { ITiposRecibo } from 'src/app/models/ITiposRecibo.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { FormTiposReciboComponent } from '../form-tipos-recibo/form-tipos-recibo.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-tipos-recibo',
  templateUrl: './lista-tipos-recibo.component.html',
  styleUrls: ['./lista-tipos-recibo.component.scss'],
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
export class ListaTiposReciboComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<ITiposRecibo>[] = [
    { label: 'Id', property: 'idTipoRecibo', type: 'text', visible: false },
    { label: 'Tipo Recibo', property: 'tipoRecibo', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<ITiposRecibo> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  tiposRecibos: ITiposRecibo[] = [];
  titulo: string = 'Tipos Recibo';
  breadcrumbsList: string[] = ['Mantenimiento', 'Tipos Recibo'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_TIPOS_RECIBOS: string = '550px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTiposRecibos();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getTiposRecibos(): void {
    this.loading = true;
    this.textTable = 'Cargando información';
    this.subList = this.mantenimientoService.obtenerTiposRecibo().subscribe({
      next: (res) => {
        this.loading = false;
        this.tiposRecibos = res.data;
        this.dataSource.data = this.tiposRecibos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.tiposRecibos.length === 0) {
          this.textTable = 'No hay tipos de recibos por mostrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.tiposRecibos = [];
        this.textTable = 'No hay tipos de recibos por mostrar.';
        console.error({ err });
      }
    }
    );
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
      this.textTable = 'No hay tipos de recibo por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarTipoRecibo(): void {
    const d = this.dialog.open(FormTiposReciboComponent, {
      data: { tipoRecibo: null },
      width: this.SIZE_DIALOG_FORM_TIPOS_RECIBOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (tipoRecibo: ITiposRecibo) => {
        if (tipoRecibo) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarTipoRecibo(tipoRecibo).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Tipo de recibo creado correctamente.', 'SUCCESS');
              this.getTiposRecibos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el tipo de recibo. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarTipoRecibo(tipoRecibo: ITiposRecibo): void {
    const d = this.dialog.open(FormTiposReciboComponent, {
      data: { tipoRecibo },
      width: this.SIZE_DIALOG_FORM_TIPOS_RECIBOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedTipoRecibo: ITiposRecibo) => {
        if (updatedTipoRecibo) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarTipoRecibo(updatedTipoRecibo.idTipoRecibo.toString(), updatedTipoRecibo).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificacionService.showMessage(res.message ? res.message : 'Tipo de recibo actualizado correctamente.', 'SUCCESS');
              this.getTiposRecibos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del tipo de recibo. Contacte con el administrador.', 'ERROR');
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
          d.updateSize(this.SIZE_DIALOG_FORM_TIPOS_RECIBOS, '');
        }
      });
  }

}
