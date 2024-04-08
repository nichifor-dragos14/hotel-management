import { InjectionToken, inject } from '@angular/core';
import { AppFormBuilder } from '$core/forms';
import { Validators } from '@angular/forms';
import { LoginModel } from '$backend/services';

export const LOGIN_FORM = new InjectionToken('LOGIN_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group<LoginModel>({
      email: ['', { validators: [Validators.required] }],
      password: ['', { validators: [Validators.required] }],
    }),
});
