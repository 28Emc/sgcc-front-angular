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
import { IRoles } from 'src/app/models/IRoles.model';
import { IUsuariosList, IUsuarios, IUsuariosPersonas } from 'src/app/models/IUser.model';
import { MantenimientoService } from 'src/app/services/mantenimiento/mantenimiento.service';
import { NotificacionService } from 'src/app/services/notificacion/notificacion.service';
import { FormUsuariosComponent } from '../form-usuarios/form-usuarios.component';

@UntilDestroy()
@Component({
  selector: 'vex-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
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
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input()
  columns: TableColumn<IUsuariosList>[] = [
    { label: 'Id', property: 'idUsuario', type: 'text', visible: false },
    { label: 'Nombre Completo', property: 'nombreCompleto', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Nro Documento', property: 'nroDocumento', type: 'text', visible: true, cssClasses: ['font-medium'] },
    { label: 'Rol', property: 'rol', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Género', property: 'genero', type: 'icon', visible: true, cssClasses: ['font-medium'] },
    { label: 'Teléfono', property: 'telefono', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Email', property: 'email', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Usuario', property: 'usuario', type: 'text', visible: true, cssClasses: ['text-secondary'] },
    { label: 'Estado', property: 'estado', type: 'badge', visible: true, cssClasses: ['font-medium'] },
    { label: 'Acciones', property: 'acciones', type: 'button', visible: true }
  ];
  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);
  subList: Subscription = new Subscription();
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<IUsuariosList> | null = new MatTableDataSource();
  layoutCtrl = new FormControl('fullwidth');
  searchCtrl = new FormControl();
  usuarios: IUsuariosList[] = [];
  roles: IRoles[] = [];
  titulo: string = 'Usuarios';
  breadcrumbsList: string[] = ['Mantenimiento', 'Usuarios'];
  loading: boolean = false;
  textTable: string = '';
  readonly SIZE_DIALOG_FORM_USUARIOS: string = '950px';

  constructor(
    private mantenimientoService: MantenimientoService,
    private notificacionService: NotificacionService,
    private readonly breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUsuarios();
    this.getRoles();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  getUsuarios(): void {
    this.loading = true;
    this.textTable = 'Cargando información...';
    this.subList = this.mantenimientoService.obtenerUsuarios().subscribe({
      next: (res) => {
        this.loading = false;
        this.usuarios = this.mapUsuarios(res.data);
        this.dataSource.data = this.usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.textTable = (this.usuarios.length === 0) ? 'No hay usuarios por mostrar.' : '';
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.usuarios = [];
        this.textTable = 'No hay usuarios por mostrar.';
        console.error({ err });
      }
    });
  }

  mapUsuarios(data: IUsuarios[]): IUsuariosList[] {
    return data.map((u: IUsuarios) => {
      let usuarioItem: IUsuariosList = {} as IUsuariosList;
      usuarioItem.idUsuario = u.idUsuario;
      usuarioItem.usuario = u.usuario;
      usuarioItem.password = u.password;
      usuarioItem.estado = u.estado;
      usuarioItem.estadoDsc = u.estado === 'A' ? 'ACTIVO' : 'BAJA';
      usuarioItem.fechaCreacion = u.fechaCreacion;
      usuarioItem.fechaActualizacion = u.fechaActualizacion;
      usuarioItem.fechaBaja = u.fechaBaja;
      usuarioItem.isActivo = u.isActivo;
      usuarioItem.idPersona = u.persona.idPersona;
      usuarioItem.tipoDocumento = u.persona.tipoDocumento;
      usuarioItem.nroDocumento = u.persona.nroDocumento;
      usuarioItem.genero = u.persona.genero;
      usuarioItem.generoDsc = u.persona.genero === 'M' ? 'MASCULINO' : u.persona.genero === 'F' ? 'FEMENINO' : 'OTRO';
      usuarioItem.nombres = u.persona.nombres;
      usuarioItem.apellidoPaterno = u.persona.apellidoPaterno;
      usuarioItem.apellidoMaterno = u.persona.apellidoMaterno;
      usuarioItem.nombreCompleto = u.persona.nombres.concat(', ', u.persona.apellidoPaterno, ' ', u.persona.apellidoMaterno);
      usuarioItem.direccion = u.persona.direccion;
      usuarioItem.telefono = u.persona.telefono;
      usuarioItem.email = u.persona.email;
      usuarioItem.idRol = u.rol.id_rol;
      usuarioItem.rol = u.rol.rol;
      usuarioItem.descripcion = u.rol.descripcion;
      usuarioItem.ruta = u.rol.ruta;
      return usuarioItem;
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
      this.textTable = 'No hay usuarios por mostrar.';
    }
  }

  get visibleColumns(): string[] {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  trackByProperty<T>(_index: number, column: TableColumn<T>): string | keyof T {
    return column.property;
  }

  registrarUsuario(): void {
    let roles = this.roles;
    const d = this.dialog.open(FormUsuariosComponent, {
      data: { usuario: null, roles },
      width: this.SIZE_DIALOG_FORM_USUARIOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (usuario: IUsuariosPersonas) => {
        if (usuario) {
          this.loading = true;
          this.subList = this.mantenimientoService.registrarUsuario(usuario).subscribe({
            next: () => {
              this.loading = false;
              this.notificacionService.showMessage('Usuario creado correctamente.', 'SUCCESS', null, 'center');
              this.getUsuarios();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              console.error({ err });
              this.notificacionService.showMessage('Error al crear el usuario. Contacte con el administrador.', 'ERROR');
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarUsuario(usuario: IUsuarios): void {
    let roles = this.roles;
    const d = this.dialog.open(FormUsuariosComponent, {
      data: { usuario, roles },
      width: this.SIZE_DIALOG_FORM_USUARIOS,
      maxWidth: '100vw',
      disableClose: true
    });

    const smallDialogSubscription = this.matDialogExtraSmallSub(d);

    d.afterClosed().subscribe(
      (updatedUsuario: IUsuariosPersonas) => {
        if (updatedUsuario) {
          this.loading = true;
          this.subList = this.mantenimientoService.actualizarUsuario(updatedUsuario.idUsuario.toString(), updatedUsuario).subscribe({
            next: (res: any) => {
              this.loading = false;
              this.notificacionService.showMessage(res.message ? res.message : 'Usuario actualizado correctamente.', 'SUCCESS', null, 'center');
              this.getUsuarios();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificacionService.showMessage('Error al actualizar los datos del usuario. Contacte con el administrador.', 'ERROR');
              console.error({ err });
            }
          });
        }

        smallDialogSubscription.unsubscribe();
      }
    );
  }

  actualizarEstadoUsuario(usuario: IUsuarios): void {
    let estado = usuario.estado === 'A' ? 'B' : 'A';
    let updateEstadoBody = { id: usuario.idUsuario, estado };
    this.loading = true;
    this.subList = this.mantenimientoService.actualizarEstadoUsuario(updateEstadoBody).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notificacionService.showMessage(res.message ? res.message : 'Estado del usuario actualizado correctamente.', 'SUCCESS', null, 'center');
        this.getUsuarios();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.notificacionService.showMessage('Error al actualizar el estado del usuario. Contacte con el administrador.', 'ERROR');
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
          d.updateSize(this.SIZE_DIALOG_FORM_USUARIOS, '');
        }
      });
  }
}
