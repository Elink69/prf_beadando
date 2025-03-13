import { inject } from '@angular/core';
import { CanActivateFn, RouteConfigLoadEnd, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, of, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(UserService).checkauth().pipe(map(isAuthenticated => {
    if (!isAuthenticated) {
      router.navigateByUrl("/login");
      return false;
    } else {
      console.log("user is authenticated")
      return true;
    }
  }), catchError(error => {
    console.log(error);
    router.navigateByUrl("/login");
    return of(false);
  }))
};
