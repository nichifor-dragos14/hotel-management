import { InjectionToken, inject } from '@angular/core';
import { AppFormBuilder } from '$core/forms';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { Gender, RegisterCommand } from '$backend/services';

export const REGISTER_FORM = new InjectionToken('REGISTER_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group<RegisterCommand>({
      address: [
        '',
        { validators: [Validators.required, Validators.maxLength(200)] },
      ],
      dateOfBirth: ['', { validators: [Validators.required] }],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      firstName: [
        '',
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      gender: [Gender.$0, { validators: [Validators.required] }],
      lastName: [
        '',
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      nationality: [
        '',
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(16),
            Validators.minLength(8),
            hasUppercase(),
            hasNumber(),
            hasSpecialCharacter(),
          ],
        },
      ],
      phoneNumber: [
        '',
        { validators: [Validators.required, phoneNumberValidator()] },
      ],
    }),
});

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const validPhoneNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (control.value) {
      const isValid = validPhoneNumberRegex.test(control.value);
      return isValid ? null : { invalidPhoneNumber: { value: control.value } };
    }
    return null;
  };
}

export function hasUppercase(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasUppercaseRegex = /[A-Z]/;
    if (control.value && !hasUppercaseRegex.test(control.value)) {
      return { noUppercase: { value: control.value } };
    }
    return null;
  };
}

export function hasNumber(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasNumberRegex = /\d/;
    if (control.value && !hasNumberRegex.test(control.value)) {
      return { noNumber: { value: control.value } };
    }
    return null;
  };
}

export function hasSpecialCharacter(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const hasSpecialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (control.value && !hasSpecialCharacterRegex.test(control.value)) {
      return { noSpecialCharacter: { value: control.value } };
    }
    return null;
  };
}
