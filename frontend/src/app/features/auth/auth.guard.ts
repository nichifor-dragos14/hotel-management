import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);
  loginService = inject(LoginService);

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let url: string = state.url;

    return this.checkUserLogin(next, url);
  }

  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    const userRole = this.loginService.getLoggedUserRole();

    const allowedRoles = route.data['role'];

    if (allowedRoles.length == 0) {
      return false;
    }

    for (let role of allowedRoles) {
      if (role == userRole) {
        return true;
      }
    }

    if (!userRole) {
      this.router.navigate(['/auth/login']);

      return false;
    }

    if (userRole == 'Admin') {
      this.router.navigate(['/properties/admin']);
    } else {
      this.router.navigate(['/main/our-recommendations']);
    }

    return false;
  }
}
