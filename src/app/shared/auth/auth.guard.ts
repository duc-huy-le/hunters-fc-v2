import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Redirect to login page if the user is not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    // Alarm when user is not granted to access the resource
    return true;
  }
}
export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
