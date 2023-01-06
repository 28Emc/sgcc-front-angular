import { SecurityService } from 'src/app/services/security/security.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private securityService: SecurityService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1 - OBTENER EL TOKEN ACTUAL Y AGREGARLO A LA PETICIÓN.
    if (this.securityService.obtenerAccessToken() && !request.url.includes('/refresh')) {
      request = this.addToken(request, this.securityService.obtenerAccessToken());
    }

    return next.handle(request).pipe(catchError(error => {
      // 2 - VERIFICAR SI EL TOKEN YA EXPIRÓ Y/O EXISTE UN ERROR DE PERMISOS POR PARTE DEL SERVIDOR.
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        return this.handle401And403Error(request, next);
      } else {
        return throwError(() => new Error(error));
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401And403Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 3 - SI YA EXPIRÓ, Y AÚN NO HA SIDO ACTUALIZADO, EL INTERCEPTOR VA A LLAMAR AL ENDPOINT "/auth/token/refresh"
    // SOLO PARA LA PRIMERA PETICIÓN (YA QUE EL INTERCEPTOR SE ACTIVA POR CADA PETICIÓN), SE OBTIENE EL NUEVO TOKEN
    // Y SE ALMACENA.
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.securityService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }));
    } else {
      // 4 - SI YA HA SIDO ACTUALIZADO EL TOKEN, SE OBTIENE EL TOKEN ACTUALIZADO DESDE EL "refreshTokenSubject"
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}
