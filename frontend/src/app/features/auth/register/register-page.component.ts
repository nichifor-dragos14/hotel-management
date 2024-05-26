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
import { REGISTER_FORM } from '../register.form';
import { AuthService, Gender, RegisterCommand, Role } from '$backend/services';
import { LoginService } from '../login.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AppToastService } from '$shared/toast';
import { MatSelectModule } from '@angular/material/select';

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
    MatIconModule,
    MatSelectModule,
  ],
})
export class RegisterPageComponent implements OnInit {
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly loginService = inject(LoginService);
  readonly toastrService = inject(AppToastService);
  readonly registerForm = inject(REGISTER_FORM);

  genderEnum = Gender;
  roleEnum = Role;

  ngOnInit() {
    if (this.loginService.getLoggedUserId()) {
      this.router.navigate(['main/our-recommendations']);
    }
  }

  async register(value: typeof this.registerForm.value) {
    if (!this.registerForm.valid) {
      return;
    }

    try {
      const response = await this.authService.authRegisterPostAsync({
        body: value as RegisterCommand,
      });

      this.toastrService.open(
        'Succesfully created account. The activation link was sent to your email.',
        'info'
      );
    } catch (error: any) {
      console.log(error);
      this.toastrService.open(error.error, 'error');
    } finally {
      this.registerForm.reset();
      this.router.navigate(['/auth/login']);
    }
  }
}
