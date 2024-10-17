import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { SecurityService } from '../services/security.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, map, switchMap, take, throwError } from 'rxjs';
import { IAPIResponsePOST } from '../interfaces/IApiResponse.interface';

export const JwtInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (urlIsInWhitelist(req)) return next(req);

  const securityService = inject(SecurityService);
  const router = inject(Router);
  let authReq = addTokenHeader(req, securityService.getAccessToken());

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([HttpStatusCode.Unauthorized, HttpStatusCode.Forbidden].includes(error.status)) {
        return securityService.refreshToken().pipe(
          map((tokenData: IAPIResponsePOST<any>) => tokenData.data.accessToken),
          filter((token: string) => token !== null),
          take(1),
          switchMap((newToken: string) => {
            authReq = addTokenHeader(req, newToken);
            return next(authReq);
          }),
          catchError(err => {
            securityService.clearSessionStorageData();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      } else {
        return throwError(() => error);
      }
    })
  );
}

function addTokenHeader(req: HttpRequest<any>, token: string | null): HttpRequest<any> {
  if (token) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }
  return req;
}

function urlIsInWhitelist(req: HttpRequest<any>): boolean {
  return req.url.search(/login/gi) !== -1 || req.url.search(/refresh-token/gi) !== -1;
}
