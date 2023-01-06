import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security/security.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  hasTokenBeenUpdated: boolean = false;
  accessTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1 - OBTENER EL TOKEN ACTUAL.
    const myRawToken = sessionStorage.getItem('tkn');
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(myRawToken);

    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        // 2 - VERIFICAR SI EL TOKEN YA EXPIRÓ.
        if (e instanceof HttpErrorResponse && e.status === 401 && isExpired) {
          // 3 - SI YA EXPIRÓ, Y AÚN NO HA SIDO ACTUALIZADO, EL INTERCEPTOR VA A LLAMAR AL ENDPOINT "/auth/refresh"
          // SOLO PARA LA PRIMERA PETICIÓN (YA QUE EL INTERCEPTOR SE ACTIVA POR CADA PETICIÓN), SE OBTIENE EL NUEVO TOKEN
          // Y SE ALMACENA.
          if (!this.hasTokenBeenUpdated) {
            this.hasTokenBeenUpdated = true;
            this.accessTokenSubject.next(null);

            return this.securityService.refreshToken().pipe(
              switchMap((authResponse: any) => {
                this.hasTokenBeenUpdated = false;
                this.accessTokenSubject.next(authResponse.token);
                sessionStorage.setItem('tkn', authResponse.token);
                return next.handle(req);
              }),
              catchError((e2: HttpErrorResponse) => {
                this.hasTokenBeenUpdated = false;
                // 4 - EN CASO NO SE PUEDA ACTUALIZAR EL TOKEN, SE DERIVA EL USUARIO A LA PANTALLA DE INICIO SESIÓN.
                sessionStorage.clear();
                this.router.navigate(['/auth/login']);
                return throwError(() => new Error(e2.message));
              })
            );

          } else {

            // 5 - SI YA HA SIDO ACTUALIZADO EL TOKEN, SE OBTIENE EL TOKEN ACTUALIZADO DESDE EL "subject"
            return this.accessTokenSubject.pipe(
              filter(accessToken => accessToken !== null),
              take(1),
              switchMap(token => {
                sessionStorage.setItem('tkn', token);
                return next.handle(req);
              }));

          }
        }

        return throwError(() => new Error(e.message));
      })
    );
  }
}
