// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      // If token doesn't exist, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }

    // You should have logic here to verify token validity

    return true; // Return true if token is valid
  }
}
