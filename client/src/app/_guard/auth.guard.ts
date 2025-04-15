import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AcountService } from '../_services/acount.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AcountService);
  const toastr = inject(ToastrService);
  if (accountService.currentuser()) {
    return true;
  }
  toastr.error('you are not allowed to go there');
  return false;
};
