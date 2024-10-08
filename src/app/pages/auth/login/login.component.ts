import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SecurityService } from 'src/app/services/security.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActionButtonComponent } from "../../../shared/action-button/action-button.component";
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule,
    RouterLink,
    ActionButtonComponent
  ]
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  inputType = 'password';
  visible = false;
  loading: boolean = false;
  securityService = inject(SecurityService);
  notificationService = inject(NotificationService);

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly cd: ChangeDetectorRef
  ) {
    sessionStorage.clear();
  }

  login(): void {
    this.loading = true;
    this.form.disable();
    this.securityService.login(this.form.getRawValue()).subscribe({
      next: payload => {
        this.loading = false;
        this.form.enable();

        this.securityService.storeTokenData(payload.data['token'], payload.data['refresh_token']);
        this.securityService.storeUserData(payload.data['user']);
        this.securityService.storeSystemOptions(payload.data['options']);
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.form.enable();
        this.notificationService.showSnackbar((error as Error).message || 'Error de inicio de sesión', 'ERROR');
      },
      complete: () => {
        this.loading = false;
        this.form.enable();
      }
    });
  }

  toggleVisibility(): void {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
