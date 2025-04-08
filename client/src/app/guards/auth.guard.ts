import { inject } from '@angular/core';
import { CanActivateFn, RouteConfigLoadEnd, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, of, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  return inject(UserService).checkauth().pipe(map(isAuthenticated => {
    if (!isAuthenticated) {
      router.navigateByUrl("/login");
      return false;
    } else {
      return true;
    }
  }), catchError(error => {
    router.navigateByUrl("/login");
    return of(false);
  }))
};
