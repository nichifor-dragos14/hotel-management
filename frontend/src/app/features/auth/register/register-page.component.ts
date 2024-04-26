import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { REGISTER_FORM } from '../register.form';
import { AuthService, Gender, RegisterCommand } from '$backend/services';
import { LoginService } from '../login.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class RegisterPageComponent {
  registerForm = inject(REGISTER_FORM);
  authService = inject(AuthService);
  loginService = inject(LoginService);
  router = inject(Router);

  genderEnum = Gender;

  async register(value: typeof this.registerForm.value) {
    if (!this.registerForm.valid) {
      return;
    }

    try {
      const response = await this.authService.authRegisterPostAsync({
        body: value as RegisterCommand,
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.router.navigate(['/auth/login']);
    }
  }
}
