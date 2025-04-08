import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { map, catchError, of } from 'rxjs';
import { UserRoles } from '../enums/userRoles';
import { ToastrService } from 'ngx-toastr';

export function roleCheckGuard(requiredRole: UserRoles): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const toastr = inject(ToastrService)
    return inject(UserService).getUserRole().pipe(map(userRole => {
      if (userRole){
        if (userRole.role <= requiredRole){
          return true;
        }else{
          router.navigateByUrl("/home");
          return false;
        }
      } else {
        router.navigateByUrl("/home");
        return false;
      }
    }), catchError(error => {
      return of(false);
    })
  )};
};
