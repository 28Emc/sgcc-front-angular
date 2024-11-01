import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActionButtonComponent } from 'src/app/shared/action-button/action-button.component';
import { CancelButtonComponent } from 'src/app/shared/cancel-button/cancel-button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IUser } from 'src/app/interfaces/IUser.interface';
import { IService } from 'src/app/interfaces/IService.interface';
import { IArea } from 'src/app/interfaces/IArea.interface';
import { NotificationService } from 'src/app/services/notification.service';
import { DateTime } from 'luxon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SecurityService } from 'src/app/services/security.service';
import { CustomDynamicFormService } from 'src/app/services/custom-dynamic-form.service';
import { IFieldConfig } from 'src/app/interfaces/IFieldConfig.interface';
import { ROLES, USER_ROLE } from 'src/app/utils/constants';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-user-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    NgIf,
    NgClass,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    ActionButtonComponent,
    CancelButtonComponent,
    TitleCasePipe
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  initialFormValues: { [key: string]: any } = {};
  formFields: IFieldConfig[] = [];
  mode: 'create' | 'update' = 'create';
  titulo: string = 'Nuevo usuario';
  loading: boolean = false;
  visible: boolean = false;
  rolesData: any[] = ROLES;

  notificacionService = inject(NotificationService);
  securityService = inject(SecurityService);
  dynamicFormService = inject(CustomDynamicFormService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      user: IUser | null,
      services: IService[],
      areas: IArea[]
    },
    private readonly dialogRef: MatDialogRef<UserFormComponent>
  ) {
    this.formFields = [
      { name: 'id', value: '', disabled: true, hidden: true },
      { name: 'role', value: USER_ROLE, disabled: true },
      { name: 'alias', value: '', disabled: false },
      { name: 'username', value: '', disabled: false, validators: [Validators.required] },
      { name: 'password', value: '', disabled: false, validators: [Validators.required] },
      { name: 'createdAt', value: '', disabled: true }
    ];
    this.form = this.dynamicFormService.createForm(this.formFields);
    this.initialFormValues = this.form.getRawValue();
  }

  ngOnInit() {
    if (this.data.user) {
      this.mode = 'update';
      this.titulo = 'Actualizar datos de usuario';
      this.handleExistingUser();
    } else {
      this.data.user = {} as IUser;
      this.form.removeControl('id');
    }
  }

  ngOnDestroy(): void {
    this.form.reset(this.initialFormValues);
  }

  handleExistingUser(): void {
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.form.patchValue({
      id: this.data.user!.id,
      alias: this.data.user!.alias,
      username: this.data.user!.username,
      role: this.data.user!.role,
      createdAt: DateTime.fromFormat(this.data.user!.createdAt, 'yyyy-MM-dd HH:mm:ss').toString()
    });
  }

  saveData(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificacionService.showSnackbar('Completar los campos requeridos', 'WARNING');
      return;
    }

    const registeredData = this.form.getRawValue();
    const { password, ...updatedData } = this.form.getRawValue();
    this.dialogRef.close(this.isCreateMode() ? registeredData : updatedData);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
