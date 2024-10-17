import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { UserFormComponent } from './user-form/user-form.component';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe, DecimalPipe, NgClass, NgFor, UpperCasePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { IUser } from 'src/app/interfaces/IUser.interface';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Router } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IService } from 'src/app/interfaces/IService.interface';
import { IArea } from 'src/app/interfaces/IArea.interface';
import { getBadgeStyles } from 'src/app/utils/utilFunctions';

@Component({
  selector: 'vex-user',
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    NgClass,
    NgFor,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule,
    UpperCasePipe,
    DatePipe,
    DecimalPipe,
    MatDialogModule
  ],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @Input()
  columns: TableColumn<IUser>[] = [
    { label: 'Id', property: 'id', type: 'id', visible: true, cssClasses: ['text-xs font-medium'] },
    { label: 'Alias', property: 'alias', type: 'text', visible: true, cssClasses: ['text-xs font-medium'] },
    { label: 'Usuario', property: 'username', type: 'text', visible: true, cssClasses: ['text-xs font-medium'] },
    { label: 'Rol', property: 'role', type: 'badge', visible: true, cssClasses: ['text-xs font-medium'] },
    { label: 'Fecha Registro', property: 'createdAt', type: 'datetime', visible: true, cssClasses: ['text-xs font-medium'] },
    { label: 'Acciones', property: 'acciones', type: 'action', visible: true }
  ];
  title: string = 'Usuarios';
  textTable: string = 'No hay información por mostrar.';
  loading: boolean = false;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50];
  searchCtrl = new FormControl({ value: '', disabled: this.loading });
  customDialogConfig: MatDialogConfig = {};
  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  areasList: IArea[] = [];
  servicesList: IService[] = [];

  router: Router = inject(Router);
  destroyRef: DestroyRef = inject(DestroyRef);
  dialog: MatDialog = inject(MatDialog);
  maintenanceService: MaintenanceService = inject(MaintenanceService);
  notificationService: NotificationService = inject(NotificationService);

  ngOnInit(): void {
    this.customDialogConfig = {
      disableClose: true,
      panelClass: ['lg:w-[40%]', 'w-full']
    };
    this.fetchUsers();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value ?? ''));
  }

  ngAfterViewInit() {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  onFilterChange(value: string): void {
    this.textTable = '';

    if (!this.dataSource) {
      this.textTable = 'No hay información por mostrar.';
      return;
    }

    this.dataSource.filter = value?.trim()?.toLowerCase();
    if (!this.dataSource.filteredData.length) this.textTable = 'No hay información por mostrar.';
  }

  fetchUsers(): void {
    this.loading = true;
    this.dataSource.data = [];
    this.textTable = 'Cargando información...';
    this.searchCtrl.disable();
    this.maintenanceService.fetchUsers().subscribe({
      next: payload => {
        this.loading = false;
        this.textTable = '';
        this.searchCtrl.enable();
        this.dataSource.data = payload.data;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.textTable = 'No hay información por mostrar.';
        this.searchCtrl.enable();
        this.dataSource.data = [];
        if (err.message) this.notificationService.showSnackbar(err.message, 'ERROR');
      },
      complete: () => {
        this.loading = false;
        this.searchCtrl.enable();
      }
    });
  }

  getBadgeStyles(key: string): string[] {
    return getBadgeStyles(key);
  }

  register(): void {
    this.customDialogConfig.data = {
      user: null,
      services: this.servicesList,
      areas: this.areasList
    };
    this.dialog.open(UserFormComponent, this.customDialogConfig)
      .afterClosed()
      .subscribe((userData) => {
        if (userData) {
          this.loading = true;
          this.maintenanceService.registerUserData(userData).subscribe({
            next: (_res: any) => {
              this.loading = false;
              this.notificationService.showSnackbar('Datos del usuario registrados correctamente', 'SUCCESS');
              this.fetchUsers();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificationService.showSnackbar(err.message, 'ERROR');
            },
            complete: () => {
              this.loading = false;
            }
          });
        }
      });
  }

  update(user: IUser): void {
    this.customDialogConfig.data = {
      user,
      services: this.servicesList,
      areas: this.areasList
    };
    this.dialog.open(UserFormComponent, this.customDialogConfig)
      .afterClosed()
      .subscribe((userData: any) => {
        if (userData) {
          this.loading = true;
          this.maintenanceService.updateUserData(user.id, userData).subscribe({
            next: (_res: any) => {
              this.loading = false;
              this.notificationService.showSnackbar('Datos del usuario actualizados correctamente', 'SUCCESS');
              this.fetchUsers();
            },
            error: (err: HttpErrorResponse) => {
              this.loading = false;
              this.notificationService.showSnackbar(err.message, 'ERROR');
            },
            complete: () => {
              this.loading = false;
            }
          });
        }
      });
  }

  delete(user: IUser): void {
    this.loading = true;
    this.maintenanceService.deleteUserData(user.id).subscribe({
      next: (_res: any) => {
        this.loading = false;
        this.notificationService.showSnackbar('Usuario dado de baja correctamente', 'SUCCESS');
        this.fetchUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.notificationService.showSnackbar(err.message, 'ERROR');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  trackByProperty<IUser>(_index: number, column: TableColumn<IUser>) {
    return column.property;
  }

  get visibleColumns(): string[] {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }
}
