import { HttpErrorResponse } from '@angular/common/http';
import { SecurityService } from 'src/app/services/security/security.service';
import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private securityService: SecurityService
  ) { }

  canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let permisoValid: boolean = false;

    if (sessionStorage.getItem('user') && sessionStorage.getItem('perm')) {
      let userLogged = JSON.parse(sessionStorage.getItem('user'));
      let permisos: any[] = JSON.parse(sessionStorage.getItem('perm'));

      if (!userLogged) {
        console.log("user not logged in");
        this.redirectLogin();
      }

      if (!permisos) {
        console.log("user has not permisos");
        this.redirectLogin(userLogged);
      }

      permisoValid = this.isRouteFromPermisoValid(permisos, state);

      if (permisoValid === false) {
        console.log("user has not valid permisos");
        this.redirectLogin(userLogged);
      }

    } else {
      console.log("user or permisos not found");
      this.redirectLogin();
    }

    return true;
  }

  isRouteFromPermisoValid(permisos: any[], state: RouterStateSnapshot): boolean {
    let isValid: boolean = false;

    permisos.forEach(permPadre => {
      if (permPadre.children) {
        permPadre.children.forEach(permHijo => {
          if (state.url.startsWith(permHijo.route)) {
            isValid = true;
          }
        });
      }
    });

    return isValid;
  }

  redirectLogin(user?: any): boolean {
    if (user) {
      let data = { id_usuario: user.id_usuario };

      this.securityService.cerrarSesión(data).subscribe({
        next: () => console.log("Sesión actualizada y cerrada con Guard"),
        error: (err: HttpErrorResponse) => console.error("Hubo un error a la hora de cerrar la sesión con Guard", err)
      });
    }

    this.router.navigate(['/auth/login']);
    sessionStorage.clear();
    return false;
  }
}
