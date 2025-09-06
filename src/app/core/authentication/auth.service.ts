import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, of, share, switchMap, tap } from 'rxjs';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { LoginService } from './login.service';
import { GymOwnerAuthService } from './gym-owner-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly gymOwnerAuthService = inject(GymOwnerAuthService);

  private user$ = new BehaviorSubject<User>({});

  init() {
    return new Promise<void>(resolve => {
      // Initialize with gym owner auth state
      if (this.gymOwnerAuthService.isAuthenticated()) {
        const currentUser = this.gymOwnerAuthService.getCurrentUser();
        if (currentUser) {
          this.user$.next({
            id: currentUser.userId,
            email: currentUser.userEmail,
            role: currentUser.userRole,
            gym: currentUser.gymData
          });
        }
      }
      resolve();
    });
  }

  check() {
    return this.gymOwnerAuthService.isAuthenticated();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.gymOwnerAuthService.login(username, password).pipe(
      map(result => result.success)
    );
  }

  logout() {
    return this.gymOwnerAuthService.logout().pipe(
      tap(() => this.user$.next({})),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    const menulist = this.loginService.menu();
    console.log(menulist, '===menulist');
    return menulist;
  }

  Clientmenu() {
    const menulist = this.loginService.clientmenu();
    console.log(menulist, '===client');
    return menulist;
  }
}
