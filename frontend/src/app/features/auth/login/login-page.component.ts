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
import { MatIconModule } from '@angular/material/icon';
import { AppToastService } from '$shared/toast';

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
    MatIconModule,
  ],
})
export class LoginPageComponent implements OnInit {
  readonly router = inject(Router);
  readonly location = inject(Location);
  readonly loginForm = inject(LOGIN_FORM);
  readonly authService = inject(AuthService);
  readonly loginService = inject(LoginService);
  readonly toastrService = inject(AppToastService);

  ngOnInit() {
    if (this.loginService.getLoggedUserId()) {
      this.router.navigate(['/main/our-recommendations']);
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
        this.toastrService.open('Successfully logged in', 'info');

        if (this.loginService.getLoggedUserRole() == 'Client') {
          this.location.back();
        } else {
          this.router.navigate(['properties/admin']);
        }

        this.loginForm.reset();
      }
    } catch (error: any) {
      this.toastrService.open(error.error, 'error');
    }
  }
}
