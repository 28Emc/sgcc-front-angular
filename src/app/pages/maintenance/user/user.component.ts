import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { UserFormComponent } from './user-form/user-form.component';
import { NotificationService } from 'src/app/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IUser } from 'src/app/interfaces/IUser.interface';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Router } from '@angular/router';
import { MaintenanceService } from 'src/app/services/maintenance.service';
import { IService } from 'src/app/interfaces/IService.interface';
import { IArea } from 'src/app/interfaces/IArea.interface';
import { CustomMatDialogConfigService } from 'src/app/services/custom-mat-dialog-config.service';
import { CrudTableComponent } from "../../../shared/crud-table/crud-table.component";
import { ICrudAction } from 'src/app/interfaces/ICrudAction.interface';

@Component({
  selector: 'vex-user',
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    CrudTableComponent,
    MatDialogModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  router: Router = inject(Router);
  destroyRef: DestroyRef = inject(DestroyRef);
  dialog: MatDialog = inject(MatDialog);
  customMatConfigService: CustomMatDialogConfigService = inject(CustomMatDialogConfigService);
  maintenanceService: MaintenanceService = inject(MaintenanceService);
  notificationService: NotificationService = inject(NotificationService);

  columns: TableColumn<IUser>[] = [];
  menuItems: ICrudAction[] = [];
  title: string = 'Usuarios';
  loading: boolean = false;
  usersList: IUser[] = [];
  areasList: IArea[] = [];
  servicesList: IService[] = [];
  customDialogConfig = computed(() => this.customMatConfigService.getDialogConfig());

  ngOnInit(): void {
    this.columns = [
      { label: 'Id', property: 'id', type: 'id', visible: true, cssClasses: ['text-xs font-medium'] },
      { label: 'Alias', property: 'alias', type: 'text', visible: true, cssClasses: ['text-xs font-medium'] },
      { label: 'Usuario', property: 'username', type: 'text', visible: true, cssClasses: ['text-xs font-medium'] },
      { label: 'Rol', property: 'role', type: 'badge', visible: true, cssClasses: ['text-xs font-medium'] },
      { label: 'Fecha Registro', property: 'createdAt', type: 'datetime', visible: true, cssClasses: ['text-xs font-medium'] },
      { label: 'Acciones', property: 'acciones', type: 'action', visible: true }
    ];
    this.menuItems = [
      {
        position: 'HEADER',
        label: 'Nuevo usuario',
        icon: 'mat:add',
        action: () => this.register(),
        showCondition: true,
        disabledCondition: () => this.loading,
        loadingCondition: () => this.loading
      },
      {
        position: 'TABLE',
        label: 'Actualizar datos',
        action: (element) => this.update(element),
        showCondition: true,
        disabledCondition: () => this.loading,
        loadingCondition: () => this.loading
      },
      {
        position: 'TABLE',
        label: 'Dar de baja',
        action: (element) => this.delete(element),
        showCondition: false,
        disabledCondition: (element) => this.loading || element['status'] === false,
        loadingCondition: () => this.loading
      }
    ];

    if (!this.menuItems.length || this.menuItems.filter(m => m.position === 'TABLE').every(m => !m.showCondition)) {
      const idx = this.columns.findIndex(c => c.property === 'acciones');
      if (idx !== -1) this.columns[idx].visible = false;
    }

    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.usersList = [];
    this.maintenanceService.fetchUsers().subscribe({
      next: payload => {
        this.loading = false;
        this.usersList = payload.data;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.usersList = [];
        if (err.message) this.notificationService.showSnackbar(err.message, 'ERROR');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  register(): void {
    this.customDialogConfig().data = {
      user: null,
      services: this.servicesList,
      areas: this.areasList
    };
    this.dialog.open(UserFormComponent, this.customDialogConfig())
      .afterClosed()
      .subscribe((usersList) => {
        if (usersList) {
          this.loading = true;
          this.maintenanceService.registerUserData(usersList).subscribe({
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
    this.customDialogConfig().data = {
      user,
      services: this.servicesList,
      areas: this.areasList
    };
    this.dialog.open(UserFormComponent, this.customDialogConfig())
      .afterClosed()
      .subscribe((usersList: any) => {
        if (usersList) {
          this.loading = true;
          this.maintenanceService.updateUserData(user.id, usersList).subscribe({
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
}
