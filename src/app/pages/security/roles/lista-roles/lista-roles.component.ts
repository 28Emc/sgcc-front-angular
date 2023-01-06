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
import { IRoles, Roles } from 'src/app/models/IRoles.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { FormRolesComponent } from '../form-roles/form-roles.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-roles',
  templateUrl: './lista-roles.component.html',
  styleUrls: ['./lista-roles.component.scss'],
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
export class ListaRolesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<IRoles>[] = [
    { label: 'Id', property: 'idRol', type: 'text', visible: false },
    { label: 'Rol', property: 'rol', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Ruta', property: 'ruta', type: 'text', visible: false, cssClasses: ['text-secondary'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<IRoles> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  roles: Roles[] = [];
  titulo: string = 'Roles';
  breadcrumbsList: string[] = ['Mantenimiento', 'Roles'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_ROLES: string = '650px';
  readonly SIZE_DIALOG_PERMISOS_ROLES: string = '1000px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRoles();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getRoles(): void {
    this.loading = true;
    this.textTable = 'Cargando información';
    this.subList = this.mantenimientoService.obtenerRoles().subscribe({
      next: (res) => {
        this.loading = false;
        this.roles = res.data;
        this.dataSource.data = this.roles;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.roles.length === 0) {
          this.textTable = 'No hay roles por mostrar.';
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.roles = [];
        this.textTable = 'No hay roles por mostrar.';
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
      this.textTable = 'No hay roles por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarRol(): void {
    const d = this.dialog.open(FormRolesComponent, {
      width: this.SIZE_DIALOG_FORM_ROLES,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (rol: IRoles) => {
        if (rol) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarRol(rol).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Rol creado correctamente.', 'SUCCESS');
              this.getRoles();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el rol. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarRol(rol: IRoles): void {
    const d = this.dialog.open(FormRolesComponent, {
      data: rol,
      width: this.SIZE_DIALOG_FORM_ROLES,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedRol: IRoles) => {
        if (updatedRol) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarRol(updatedRol.id_rol.toString(), updatedRol).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Rol actualizado correctamente.', 'SUCCESS');
              this.getRoles();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del rol. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  editarPermisosPorRol(rol: IRoles): void {
    const d = this.dialog.open(FormRolesComponent, {
      data: rol,
      width: this.SIZE_DIALOG_PERMISOS_ROLES,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      updatedData => {
        if (updatedData) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarPermisosPorRol(updatedData).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Permisos actualizados correctamente.', 'SUCCESS');
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los permisos. Contacte con el administrador.', 'ERROR');
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
          d.updateSize(this.SIZE_DIALOG_FORM_ROLES, '');
        }
      });
  }
}
