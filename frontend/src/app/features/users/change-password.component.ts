import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ReactiveFormsModule,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AppPageHeaderComponent } from '$shared/page-header';
import { UserService } from '$backend/services';
import { LoginService } from '$features/auth/login.service';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-upload-profile-picture',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AppPageHeaderComponent,
  ],
  template: `
    <app-page-header title="Update your password">
      <button
        button
        mat-button
        color="primary"
        [disabled]="changePasswordForm.invalid"
        (click)="changePassword(changePasswordForm.value)"
      >
        Update
      </button>
      <button button mat-button color="warn" routerLink="../../">Close</button>
    </app-page-header>

    <form [formGroup]="changePasswordForm">
      <mat-form-field appearance="outline">
        <mat-label>Current password</mat-label>
        <input matInput formControlName="password" type="password" />
        @if (changePasswordForm.get('password')?.errors?.['required']) {
          <mat-error> The current password is required. </mat-error>
        } @else if (
          changePasswordForm.get('password')?.errors?.['passwordMismatch']
        ) {
          <mat-error> The password is not correct. </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>New password</mat-label>
        <input matInput formControlName="newPassword" type="password" />
        @if (changePasswordForm.get('newPassword')?.errors?.['required']) {
          <mat-error> The new password is required. </mat-error>
        } @else if (
          changePasswordForm.get('newPassword')?.errors?.['maxlength']
        ) {
          <mat-error> Must be under 16 characters. </mat-error>
        } @else if (
          changePasswordForm.get('newPassword')?.errors?.['minlength']
        ) {
          <mat-error> Must be over 8 characters. </mat-error>
        } @else if (
          changePasswordForm.get('newPassword')?.errors?.['noUppercase']
        ) {
          <mat-error> Must have at least one uppercase letter. </mat-error>
        } @else if (
          changePasswordForm.get('newPassword')?.errors?.['noNumber']
        ) {
          <mat-error> Must have at least one number. </mat-error>
        } @else if (
          changePasswordForm.get('newPassword')?.errors?.['noSpecialCharacter']
        ) {
          <mat-error> Must have at least one special character. </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Confirm new password</mat-label>
        <input matInput formControlName="confirmPassword" type="password" />
        @if (changePasswordForm.get('confirmPassword')?.errors?.['required']) {
          <mat-error> The confirmation password is required. </mat-error>
        } @else if (changePasswordForm.errors?.['passwordNotMatched']) {
          <mat-error> Must be the same as the new password. </mat-error>
        }
      </mat-form-field>
    </form>

    <p>
      Please keep in mind you will be logged out after changing your password.
    </p>
  `,
  styles: [
    `
      :host {
        padding: 32px 24px;
        width: 56vw;
        height: 64vh;
        display: flex;
        flex-direction: column;
        gap: 64px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 64px;
        justify-self: center;
      }

      p {
        align-self: center;
        color: grey;
      }
    `,
  ],
})
export class ChangePasswordComponent {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly userService = inject(UserService);
  readonly loginService = inject(LoginService);
  readonly toastService = inject(AppToastService);

  changePasswordForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(8),
            this.hasUppercase(),
            this.hasNumber(),
            this.hasSpecialCharacter(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.matchPassword('newPassword', 'confirmPassword'),
      }
    );
  }

  private matchPassword(
    passwordKey: string,
    confirmPasswordKey: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        const password = control.get(passwordKey);
        const confirmPassword = control.get(confirmPasswordKey);

        if (
          password &&
          confirmPassword &&
          password.value !== confirmPassword.value
        ) {
          return { passwordNotMatched: true };
        }
      }
      return null;
    };
  }

  hasUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { noUppercase: true };
    };
  }

  hasNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasNumber = /\d/.test(control.value);
      return hasNumber ? null : { noNumber: true };
    };
  }

  hasSpecialCharacter(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasSpecial = /[\W_]+/.test(control.value);
      return hasSpecial ? null : { noSpecialCharacter: true };
    };
  }

  async changePassword(newPasswordForm: typeof this.changePasswordForm.value) {
    if (this.changePasswordForm.invalid) {
      return;
    }

    try {
      await this.userService.usersPasswordPatchAsync({
        body: {
          id: this.loginService.getLoggedUserId(),
          newPassword: newPasswordForm.newPassword,
          oldPassword: newPasswordForm.password,
        },
      });

      this.toastService.open('Successfully updated password', 'info');
      this.router.navigate(['/main'], { relativeTo: this.activatedRoute });
      this.loginService.logout();
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open('Failed to change password', 'error');
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      }
    }
  }
}
