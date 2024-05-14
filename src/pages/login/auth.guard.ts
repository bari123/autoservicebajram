// auth.guard.ts
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // provides the route configuration options.
    const {routeConfig} = route;

    // provides the path of the route.
    const {path} = routeConfig as Route;

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role')

    if (!token) {
      // If token doesn't exist, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }


    return true; // Return true if token is valid
  }
}
