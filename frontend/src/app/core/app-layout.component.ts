import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LoginService } from '$features/auth/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
  ],
  template: `
    <mat-toolbar class="mat-elevation-z4">
      <mat-toolbar-row>
        <a mat-button>Hotel Management</a>
        <section role="buttons">
          @if (isLoggedIn) {
            <img
              id="profile-picture"
              alt="profile picture"
              src="assets/hotel1.jpg"
              [routerLink]="['users/my-profile/details']"
            />

            <a mat-button (click)="loginService.logout()"> Logout </a>
          } @else {
            <a mat-button [routerLink]="['/auth/login']"> Login </a>
          }
        </section>
      </mat-toolbar-row>
    </mat-toolbar>
    <mat-sidenav-container>
      <mat-sidenav mode="side" opened>
        <mat-nav-list>
          <a
            mat-list-item
            routerLink="/properties/admin"
            routerLinkActive="selected"
          >
            Properties
          </a>
          <a mat-list-item routerLink="/reports" routerLinkActive="selected">
            Reports
          </a>
          <a mat-list-item routerLink="/main" routerLinkActive="selected">
            Main page properties
          </a>
          <a
            mat-list-item
            routerLink="/bookings/my-reservations"
            routerLinkActive="selected"
          >
            My bookings
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);
  loginService = inject(LoginService);

  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscribeToLoginStatus();
  }

  private subscribeToLoginStatus(): void {
    this.subscription.add(
      this.loginService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
