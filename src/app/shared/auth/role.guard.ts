import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService, Role } from './auth.service';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, lastValueFrom, map, of, skip } from 'rxjs';
import { UserService } from '../user/user.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RoleHomepage } from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private msg: NzMessageService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    // Redirect to login page if the user is not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const requiredRoles = route.data['role'];
    // Test
    // let userInfo: any;
    // this.userService.subscribeUserInfo().subscribe((data) => {
    //   userInfo = data;
    // })
    let userInfo = await firstValueFrom(this.userService.subscribeUserInfo());
    if (userInfo == null) {
      userInfo = await firstValueFrom(
        this.userService.subscribeUserInfo().pipe(skip(1))
      );
    }

    if (userInfo) {
      if (!requiredRoles.includes(Number(userInfo?.role))) {
        if (
          route?.routeConfig?.path === 'dashboard' &&
          Number(userInfo?.role) === Role.AffiliateUser
        ) {
          this.router.navigate([RoleHomepage[Role.AffiliateUser]]);
        } else {
          this.router.navigate(['/unauthorized']);
        }
        return false;
      }
    } else {
      return false;
    }
    // Alarm when user is not granted to access the resource
    return true;
  }
  // canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
  //   // Redirect to login page if the user is not authenticated
  //   if (!this.authService.isAuthenticated()) {
  //     this.router.navigate(['/login']);
  //     return of(false);
  //   }
  //   const requiredRoles = route.data['role'];
  //   return this.userService.getUserInfo().pipe(
  //     map((userInfo) => {
  //       if (requiredRoles.includes(Number(userInfo.role))) {
  //         return true;
  //       } else {
  //         this.router.navigate(['/unauthorized']);
  //         return false;
  //       }
  //     })
  //   );
  // }
}
export const roleGuard: CanActivateFn = async (route, state) => {
  const rolesService = inject(RolesService);
  return await rolesService.canActivate(route);
};
