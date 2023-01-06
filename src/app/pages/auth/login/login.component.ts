import { NavigationSubheading } from './../../../../@vex/interfaces/navigation-item.interface';
import { NotificacionService } from './../../../services/notificacion/notificacion.service';
import { NavigationService } from './../../../../@vex/services/navigation.service';
import { SecurityService } from './../../../services/security/security.service';
import { environment } from './../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { IUserLogin } from 'src/app/models/IUser.model';
import { NavigationDropdown, NavigationLink } from 'src/@vex/interfaces/navigation-item.interface';
import { IComponentesResponse } from 'src/app/models/IComponentesResponse.interface';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInUp400ms]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  inputType: 'password' | 'text' = 'password';
  visible: boolean = false;
  loading: boolean = false;
  subList: Subscription = new Subscription();
  usuarioValidation = { minLength: 5, maxLength: 30 };
  passwordValidation = { minLength: 6, maxLength: 30 };
  usuarioFormErrors = {
    required: 'Este campo es requerido',
    minlength: 'Este campo debe tener 5 caracteres como mínimo',
    maxlength: 'Este campo debe tener 30 caracteres como maximo',
  };
  passwordFormErrors = {
    required: 'Este campo es requerido',
    minlength: 'Este campo debe tener 6 caracteres como mínimo',
    maxlength: 'Este campo debe tener 30 caracteres como maximo',
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private navigationService: NavigationService,
    private securityService: SecurityService,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
    const usuarioValidators: Validators[] = [
      Validators.required
    ];
    const passwordValidators: Validators[] = [
      Validators.required
    ];

    if (environment.production) {
      usuarioValidators.push(Validators.minLength(this.usuarioValidation.minLength));
      usuarioValidators.push(Validators.maxLength(this.usuarioValidation.maxLength));
      passwordValidators.push(Validators.minLength(this.passwordValidation.minLength));
      passwordValidators.push(Validators.maxLength(this.passwordValidation.maxLength));
    }

    this.form = this.fb.group({
      usuario: ['', usuarioValidators],
      password: ['', passwordValidators]
    });
  }

  ngOnDestroy(): void {
    this.subList.unsubscribe();
  }

  get usuario(): FormControl {
    return <FormControl>this.form.get('usuario');
  }

  get password(): FormControl {
    return <FormControl>this.form.get('password');
  }

  errors(ctrl: FormControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  verOcultarPassword(): void {
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

  iniciarSesion(): void {
    this.loading = true;
    this.form.disable();

    this.subList = this.securityService.login(this.form.getRawValue()).subscribe({
      next: res => {
        this.loading = false;

        if (!res.details || !res.details.ruta) {
          this.loading = false;
          this.form.enable();
          this.cd.detectChanges();
          this.notificacionService.showMessage('No tienes los permisos suficientes para acceder al sistema. Contacte con el administrador.', 'WARNING');
          return;
        }

        this.form.enable();
        this.cd.detectChanges();
        let permisos = res.details.permisos.filter(p => p.estado === 'A');
        this.organizarComponentes(res.details.user, permisos, res.details.sesion);
        this.router.navigate([res.details.ruta]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.form.enable();
        this.cd.detectChanges();
        console.error({ err });
        this.notificacionService.showMessage((err.status != 500) ? err.error.message : 'Usuario o contraseña incorrectos.', 'ERROR');
      }
    });
  }

  organizarComponentes(user: any, resPermisos: any[], sesion: any): void {
    // let arrComponentesPadre: NavigationDropdown[] = [];
    let arrComponentesPadre: NavigationSubheading[] = []; // PARA ITEMS DE TIPO SUBHEADING
    let padre: NavigationSubheading = {} as NavigationSubheading; // PARA ITEMS DE TIPO SUBHEADING
    let arrComponentesHijo: NavigationLink[] = [];

    if (resPermisos.length == 0) {
      this.form.enable();
      this.cd.detectChanges();
      this.notificacionService.showMessage('Error de inicio de sesión. Contactar a un administrador.', 'ERROR');
      return;
    }

    resPermisos.forEach((c: IComponentesResponse) => {
      if (c.id_componente_padre == 0) {
        // let padre: NavigationDropdown = {} as NavigationDropdown;
        // padre.type = 'dropdown';
        padre.type = 'subheading'; // PARA ITEMS DE TIPO SUBHEADING
        padre.label = c.componente;
        // padre.icon = c.icono; // NO VA EN EL SUBHEADING
        padre.id_componente = c.id_componente;
        padre.id_componente_padre = c.id_componente_padre;
        // padre.orden = c.orden; // NO VA EN EL SUBHEADING
        padre.children = [];
        arrComponentesPadre.push(padre);
      } else {
        let hijo: NavigationLink = {} as NavigationLink;
        hijo.id_componente = c.id_componente;
        hijo.id_componente_padre = c.id_componente_padre;
        hijo.type = 'link';
        hijo.icon = c.icono; // SE AGREGA EN EL SUBHEADING
        hijo.label = c.componente;
        hijo.route = c.ruta;
        hijo.orden = c.orden;
        arrComponentesHijo.push(hijo);
      }
    });

    // arrComponentesPadre.sort((a, b) => a.orden - b.orden); // NO VA EN EL SUBHEADING
    arrComponentesHijo.sort((a, b) => a.orden - b.orden);

    if (arrComponentesPadre.length > 0 && arrComponentesHijo.length > 0) {
      arrComponentesPadre.forEach(padre => {
        arrComponentesHijo.forEach(hijo => {
          if (padre.id_componente == hijo.id_componente_padre) {
            padre.children.push(hijo);
          }
        });
      });
    }

    this.navigationService.items = arrComponentesPadre;
    // sessionStorage.setItem('perm', JSON.stringify(this.navigationService.items));
    this.securityService.almacenarInfoUsuarioSessionStorage({ user, permisos: arrComponentesPadre, sesion });
  }

  restorePassword(): void {
    if (!this.loading || this.form.enabled) {
      this.router.navigate(['/auth/olvidar-password']);
    }
  }
}
