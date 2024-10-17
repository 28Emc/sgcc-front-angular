import { NgClass, NgIf } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { USER_ROLE } from 'src/app/utils/constants';
import { DateTime } from 'luxon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    ActionButtonComponent,
    CancelButtonComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  form: FormGroup = this.fb.group({
    id: [{ value: '', disabled: true }],
    alias: [''],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: [{ value: USER_ROLE, disabled: true }, [Validators.required]],
    createdAt: [{ value: '', disabled: true }],
    // state: [{ value: '', disabled: true }]
  });
  inputType: 'text' | 'password' = 'password';
  mode: 'create' | 'update' = 'create';
  titulo: string = 'Nuevo usuario';
  loading: boolean = false;
  visible: boolean = false;

  notificacionService = inject(NotificationService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      user: IUser | null,
      services: IService[],
      areas: IArea[]
    },
    private readonly dialogRef: MatDialogRef<UserFormComponent>,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {
    if (this.data?.user) {
      this.mode = 'update';
      this.titulo = 'Actualizar datos de usuario';
      this.form.patchValue({
        id: this.data.user.id,
        alias: this.data.user.alias,
        username: this.data.user.username,
        password: this.data.user.password,
        role: this.data.user.role,
        createdAt: DateTime.fromFormat(this.data.user.createdAt, 'yyyy-MM-dd HH:mm:ss').toString(),
        // state: this.data.user.status === true ? 'ACTIVO' : 'INACTIVO'
      });
    } else {
      this.data.user = {} as IUser;
      this.form.patchValue({
        role: USER_ROLE
      });
    }
  }

  toggleVisibility(): void {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
    } else {
      this.inputType = 'text';
      this.visible = true;
    }
  }

  saveData(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificacionService.showSnackbar('Completar los campos requeridos', 'WARNING');
      return;
    }

    const userData = this.form.getRawValue();
    this.dialogRef.close(userData);
  }

  isCreateMode(): boolean {
    return this.mode === 'create';
  }

  isUpdateMode(): boolean {
    return this.mode === 'update';
  }
}
