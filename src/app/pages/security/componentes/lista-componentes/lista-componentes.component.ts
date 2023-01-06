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
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable, Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { IComponentes, Componentes } from 'src/app/models/IComponentes.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { FormComponentesComponent } from '../form-componentes/form-componentes.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-componentes',
  templateUrl: './lista-componentes.component.html',
  styleUrls: ['./lista-componentes.component.scss'],
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
export class ListaComponentesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<IComponentes>[] = [
    { label: 'Id', property: 'idComponente', type: 'text', visible: false },
    { label: 'Componente', property: 'componente', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: '¿Es Componente Padre?', property: 'idComponentePadre', type: 'number', visible: true, cssClasses: ['font-medium'] },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Icono', property: 'icono', type: 'icon', visible: true, cssClasses: ['text-primary'] },
    { label: 'Ruta', property: 'ruta', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Orden', property: 'orden', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Estado', property: 'estado', type: 'badge', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<IComponentes> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  componentes: Componentes[] = [];
  titulo: string = 'Componentes';
  breadcrumbsList: string[] = ['Mantenimiento', 'Componentes'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_COMPONENTES: string = '650px';
  readonly SIZE_DIALOG_PERMISOS_COMPONENTES: string = '1000px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getComponentes();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getComponentes(): void {
    this.loading = true;
    this.textTable = 'Cargando información...';
    this.subList = this.mantenimientoService.obtenerComponentes().subscribe({
      next: (res) => {
        this.loading = false;
        this.componentes = res.data;
        this.dataSource.data = this.componentes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.textTable = (this.componentes.length === 0) ? 'No hay componentes por mostrar.' : '';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.componentes = [];
        this.textTable = 'No hay componentes por mostrar.';
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
      this.textTable = 'No hay componentes por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarComponente(): void {
    let componentesPadre = this.componentes;
    const d = this.dialog.open(FormComponentesComponent, {
      data: { componente: null, componentesPadre },
      width: this.SIZE_DIALOG_FORM_COMPONENTES,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (componente: IComponentes) => {
        if (componente) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarComponente(componente).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Componente creado correctamente.', 'SUCCESS', null, 'center');
              this.getComponentes();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el componente. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarComponente(componente: IComponentes): void {
    let componentesPadre = this.componentes;
    const d = this.dialog.open(FormComponentesComponent, {
      data: { componente, componentesPadre },
      width: this.SIZE_DIALOG_FORM_COMPONENTES,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedComponente: IComponentes) => {
        if (updatedComponente) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarComponente(updatedComponente.idComponente.toString(), updatedComponente).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Componente actualizado correctamente.', 'SUCCESS', null, 'center');
              this.getComponentes();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del componente. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarEstadoComponente(componente: IComponentes): void {
    let estado = componente.estado === 'A' ? 'B' : 'A';
    let updateEstadoBody = { id: componente.idComponente, estado };
    this.loading = true;
    this.subList = this.mantenimientoService.actualizarEstadoComponente(updateEstadoBody).subscribe({
      next: () => {
        this.loading = false;
        this.notificacionService.showMessage('Estado del componente actualizado correctamente.', 'SUCCESS', null, 'center');
        this.getComponentes();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.notificacionService.showMessage('Error al actualizar el estado del componente. Contacte con el administrador.', 'ERROR');
        console.error({ err });
      }
    });
  }

  matDialogExtraSmallSub(d: any): Subscription {
    return this.isExtraSmall.subscribe(
      size => {
        if (size.matches) {
          d.updateSize('100vw', '100vh');
        } else {
          d.updateSize(this.SIZE_DIALOG_FORM_COMPONENTES, '');
        }
      });
  }
}
