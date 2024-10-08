import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const ApiKeyInterceptorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const request = req.clone({
    setHeaders: {
      'x-api-key': environment.secretKey
    }
  });
  return next(request);
}
