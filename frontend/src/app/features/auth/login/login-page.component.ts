import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LOGIN_FORM } from '../login.form';
import { AuthService } from '$backend/services';
import { LoginService } from '../login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginPageComponent implements OnInit {
  loginForm = inject(LOGIN_FORM);
  authService = inject(AuthService);
  loginService = inject(LoginService);
  router = inject(Router);
  private location = inject(Location);

  ngOnInit() {
    if (this.loginService.getLoggedUserId()) {
      this.router.navigate(['main']);
    }
  }

  async login(value: typeof this.loginForm.value) {
    const { email, password } = value as Required<typeof value>;

    if (!this.loginForm.valid) {
      return;
    }

    try {
      const response = await this.authService.authLoginPost$ResponseAsync({
        body: { email, password },
      });

      if (response.ok) {
        this.loginService.AddJWTToSessionStorage(response.body);
        this.location.back();
        this.loginForm.reset();
      }
    } catch (error) {
      throw new Error('Bad request');
    }
  }
}
