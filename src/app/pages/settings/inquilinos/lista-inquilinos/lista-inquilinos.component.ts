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
import { IInquilinosList, Inquilinos } from 'src/app/models/IInquilinos.model';
import { IRoles } from 'src/app/models/IRoles.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { FormInquilinosComponent } from '../form-inquilinos/form-inquilinos.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-inquilinos',
  templateUrl: './lista-inquilinos.component.html',
  styleUrls: ['./lista-inquilinos.component.scss'],
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
export class ListaInquilinosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<IInquilinosList>[] = [
    { label: 'Id', property: 'idInquilino', type: 'text', visible: false },
    { label: 'Nro Documento', property: 'nroDocumento', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Nombre Completo', property: 'nombreCompleto', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Género', property: 'genero', type: 'icon', visible: true, cssClasses: ['font-medium'] },
    { label: 'Teléfono', property: 'telefono', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Email', property: 'email', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Usuario', property: 'usuario', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Fecha Inicio Contrato', property: 'fechaInicioContrato', type: 'date', visible: true, cssClasses: ['font-medium'] },
    { label: 'Fecha Fin Contrato', property: 'fechaFinContrato', type: 'date', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Estado', property: 'estado', type: 'badge', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<IInquilinosList> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  inquilinos: IInquilinosList[] = [];
  roles: IRoles[] = [];
  titulo: string = 'Inquilinos';
  breadcrumbsList: string[] = ['Mantenimiento', 'Inquilinos'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_INQUILINOS: string = '950px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getInquilinos();
    this.getRoles();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getInquilinos(): void {
    this.loading = true;
    this.textTable = 'Cargando información';
    this.subList = this.mantenimientoService.obtenerInquilinos().subscribe({
      next: (res) => {
        this.loading = false;
        this.inquilinos = this.flatMapInquilinos(res.data);
        this.dataSource.data = this.inquilinos;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.inquilinos.length === 0) {
          this.textTable = 'No hay inquilinos por mostrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.inquilinos = [];
        this.textTable = 'No hay inquilinos por mostrar.';
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

  getRoles(): void {
    this.subList = this.mantenimientoService.obtenerRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
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
      this.textTable = 'No hay inquilinos por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarInquilino(): void {
    const d = this.dialog.open(FormInquilinosComponent, {
      data: { inquilino: null, rol: this.roles.filter(r => r.rol.toLowerCase().includes('inquilino')) },
      width: this.SIZE_DIALOG_FORM_INQUILINOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (inquilino: IInquilinosList) => {
        if (inquilino) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarInquilino(inquilino).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Inquilino creado correctamente.', 'SUCCESS');
              this.getInquilinos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el inquilino. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarInquilino(inquilino: Inquilinos): void {
    const d = this.dialog.open(FormInquilinosComponent, {
      data: { inquilino, rol: this.roles.filter(r => r.rol.toLowerCase().includes('inquilino')) },
      width: this.SIZE_DIALOG_FORM_INQUILINOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedInquilino: IInquilinosList) => {
        if (updatedInquilino) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarInquilino(updatedInquilino.idInquilino.toString(), updatedInquilino).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificacionService.showMessage(res.message ? res.message : 'Inquilino actualizado correctamente.', 'SUCCESS');
              this.getInquilinos();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del inquilino. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarEstadoInquilino(inquilino: Inquilinos): void {
    let estado = inquilino.estado === 'A' ? 'B' : 'A';
    let updateEstadoBody = { id: inquilino.idInquilino, estado };
    this.loading = true;
    this.subList = this.mantenimientoService.actualizarEstadoInquilino(updateEstadoBody).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notificacionService.showMessage(res.message ? res.message : 'Estado del inquilino actualizado correctamente.', 'SUCCESS');
        this.getInquilinos();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.notificacionService.showMessage('Error al actualizar el estado del inquilino. Contacte con el administrador.', 'ERROR');
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
          d.updateSize(this.SIZE_DIALOG_FORM_INQUILINOS, '');
        }
      });
  }
}
