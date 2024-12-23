import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export  class UserAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const jwtToken = localStorage.getItem('token');
    const loginRoute = '/login';

    if (state.url !== loginRoute && jwtToken === null) {
      this.router.navigate(['/login']);
      return false; // Prevent access to the route
    } else if (state.url === loginRoute && jwtToken !== null) {
      this.router.navigate(['/home']);
      return false; // Prevent access to the route
    }

    return true; // Allow access to the route
  }
}
