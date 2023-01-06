import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1 - EXPRESIÓN REGULAR QUE MAPEA LA RUTA QUE CONTIENE '/login'
    const reLogin = /login/gi;

    // 2 - VALIDAR QUE RUTA ACTUAL NO SEA "/login", PARA NO INCLUIR EL TOKEN DE AUTENTICACIÓN EN ESA PETICIÓN.
    if (req.url.search(reLogin) === -1) {
      const token: string = sessionStorage.getItem('tkn');
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
