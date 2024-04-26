import { InjectionToken, inject } from '@angular/core';
import { AppFormBuilder } from '$core/forms';
import { Validators } from '@angular/forms';
import { Gender, RegisterCommand } from '$backend/services';

export const REGISTER_FORM = new InjectionToken('REGISTER_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group<RegisterCommand>({
      address: ['', { validators: [Validators.required] }],
      dateOfBirth: ['', { validators: [Validators.required] }],
      email: ['', { validators: [Validators.required] }],
      firstName: ['', { validators: [Validators.required] }],
      gender: [Gender.$0, { validators: [Validators.required] }],
      lastName: ['', { validators: [Validators.required] }],
      nationality: ['', { validators: [Validators.required] }],
      password: ['', { validators: [Validators.required] }],
      phoneNumber: ['', { validators: [Validators.required] }],
    }),
});
