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
  selector: 'app-root',
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
            <a mat-button (click)="loginService.logout()"> Logout </a>
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
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
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
