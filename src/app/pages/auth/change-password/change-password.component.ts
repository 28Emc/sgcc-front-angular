import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { SecurityService } from 'src/app/services/security/security.service';

@Component({
  selector: 'vex-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ChangePasswordComponent implements OnInit {
  inputType1: 'password' | 'text' = 'password';
  inputType2: 'password' | 'text' = 'password';
  inputType3: 'password' | 'text' = 'password';
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  form: FormGroup;
  loading: boolean = false;
  subList: Subscription = new Subscription();
  user: any;
  isAdmin: boolean;
  currentPasswordValidation = { minLength: 5, maxLength: 30 };
  newPasswordValidation = { minLength: 5, maxLength: 30 };
  confirmNewPasswordValidation = { minLength: 5, maxLength: 30 };
  formErrors = {
    required: 'Este campo es requerido',
    minlength: 'Este campo debe tener 5 caracteres como mínimo',
    maxlength: 'Este campo debe tener 30 caracteres como maximo'
  };
  response = {
    message: '',
    status: ''
  };
  textForm: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private securityService: SecurityService
  ) { }

  ngOnInit(): void {
    this.user = this.data.user;
    this.isAdmin = this.data.isAdmin;
    if (this.isAdmin === true) {
      this.textForm = "Escribir la nueva contraseña del usuario ".concat(this.user.usuario.toUpperCase(), ".");
      this.form = this.fb.group({
        new_password: ['', [
          Validators.required,
          Validators.minLength(this.currentPasswordValidation.minLength),
          Validators.maxLength(this.currentPasswordValidation.maxLength)
        ]]
      });
    } else {
      this.textForm = "Completar los campos para poder cambiar la contraseña actual.";
      this.form = this.fb.group({
        current_password: ['', [
          Validators.required,
          Validators.minLength(this.currentPasswordValidation.minLength),
          Validators.maxLength(this.currentPasswordValidation.maxLength)
        ]],
        new_password: ['', [
          Validators.required,
          Validators.minLength(this.currentPasswordValidation.minLength),
          Validators.maxLength(this.currentPasswordValidation.maxLength)
        ]],
        confirm_new_password: ['', [
          Validators.required,
          Validators.minLength(this.currentPasswordValidation.minLength),
          Validators.maxLength(this.currentPasswordValidation.maxLength)
        ]]
      });
    }
  }

  get currentPassword(): FormControl {
    return <FormControl>this.form.get('current_password');
  }

  get newPassword(): FormControl {
    return <FormControl>this.form.get('new_password');
  }

  get confirmNewPassword(): FormControl {
    return <FormControl>this.form.get('confirm_new_password');
  }

  errors(ctrl: FormControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  manageIconPassword(nro: number): void {
    switch (nro) {
      case 1:
        this.visible1 = this.setVisible(this.visible1);
        this.inputType1 = this.setInputType(this.visible1);
        break;
      case 2:
        this.visible2 = this.setVisible(this.visible2);
        this.inputType2 = this.setInputType(this.visible2);
        break;
      case 3:
        this.visible3 = this.setVisible(this.visible3);
        this.inputType3 = this.setInputType(this.visible3);
        break;
      default:
        break;
    }
  }

  setVisible(visible: boolean): boolean {
    return !visible;
  }

  setInputType(visible: boolean): 'text' | 'password' {
    let type: 'text' | 'password' = (visible === true) ? 'text' : 'password';
    return type;
  }

  actualizarPassword(): void {
    if (this.form.invalid) {
      this.snackbar.open('Revisar los campos ingresados antes de continuar.', null, {
        duration: 3500,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    if (this.isAdmin === true) {
      this.loading = true;
      this.form.disable();

      this.securityService.actualizarPasswordAdmin(this.user.id_usuario, this.form.getRawValue()).subscribe({
        next: () => {
          this.loading = false;
          this.form.enable();
          this.response = { message: 'La contraseña del usuario ha sido actualizada correctamente', status: 'OK' };
          this.dialogRef.close(this.response);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.form.enable();
          console.error({ err });
          this.response = { message: 'Hubo un error a la hora de actualizar la contraseña del usuario. Contacte con el administrador.', status: 'ERROR' };
          this.dialogRef.close(this.response);
        }
      });
    } else {
      if (this.newPassword.value !== this.confirmNewPassword.value) {
        this.snackbar.open('Las contraseñas no coinciden. Revisar la nueva contraseña y su confirmación para continuar.', null, {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        return;
      }

      this.loading = true;
      this.form.disable();

      this.securityService.actualizarPasswordUser(this.user.id_usuario, this.form.getRawValue()).subscribe({
        next: () => {
          this.loading = false;
          this.form.enable();
          this.response = { message: 'Contraseña actualizada correctamente', status: 'OK' };
          this.dialogRef.close(this.response);
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.form.enable();
          console.error({ err });
          this.response = { message: 'Hubo un error a la hora de actualizar la contraseña. Contacte con el administrador.', status: 'ERROR' };
          this.dialogRef.close(this.response);
        }
      });
    }
  }
}
