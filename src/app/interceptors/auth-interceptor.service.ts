import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const AuthInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const reLogin = /login/gi;
  let request = req;
  //if (req.url.search(reLogin) === -1) {
    const token = sessionStorage.getItem('tkn') ?? 'ec80f5690620d23ab137502f24165195009d9466';
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  //}
  return next(request);
}
