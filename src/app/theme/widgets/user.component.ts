import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, tap } from 'rxjs';

import { AuthService, SettingsService, User } from '@core';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-user',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <img class="avatar" src="images/teckfuel_usericon.png" width="24" alt="avatar" />
    </button>

    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
  styles: `
    .avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50rem;
    }
  `,
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
})
export class UserComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly tokenservice = inject(TokenService);
  private readonly router = inject(Router);
  private readonly settings = inject(SettingsService);

  user!: User;

  ngOnInit(): void {
    
  }

logout(): void {
  const currentUrl = this.router.url; // e.g. "/admin/dashboard" or "/client/home"

  if (currentUrl.startsWith('/admin')) {
    this.tokenservice.AdminLogout();
  } else if (currentUrl.startsWith('/client')) {
    this.tokenservice.Clientlogout();
  } else {
    // default
    this.tokenservice.AdminLogout();
    this.tokenservice.Clientlogout();
  }
}

  restore() {
    this.settings.reset();
    window.location.reload();
  }
}


//  <button routerLink="/profile/overview" mat-menu-item>
//         <mat-icon>account_circle</mat-icon>
//         <span>{{ 'profile' | translate }}</span>
//       </button>
//       <button routerLink="/profile/settings" mat-menu-item>
//         <mat-icon>edit</mat-icon>
//         <span>{{ 'edit_profile' | translate }}</span>
//       </button>
//       <button mat-menu-item (click)="restore()">
//         <mat-icon>restore</mat-icon>
//         <span>{{ 'restore_defaults' | translate }}</span>
//       </button>