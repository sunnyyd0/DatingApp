import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AcountService } from '../_services/acount.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AcountService);
  const curUser = accountService.currentuser();
  if (curUser) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${curUser?.token}`,
      },
    });
    return next(authReq);
  }
  return next(req);
};
