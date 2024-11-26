import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/login')) {
    return next(req);
  }

  const tokenService = inject(TokenService);
  if (typeof window !== 'undefined') {
    const token = tokenService.getToken();
    if (token) {
      const modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      return next(modifiedReq);
    }
  }
  return next(req);
};
