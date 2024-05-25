import { UpdateUserDetailsCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditUserDetailsFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(user: UpdateUserDetailsCommand): FormGroup {
    return this.formBuilder.group<UpdateUserDetailsCommand>({
      address: [
        user.address,
        { validators: [Validators.required, Validators.maxLength(200)] },
      ],
      dateOfBirth: [user.dateOfBirth, { validators: [Validators.required] }],
      firstName: [
        user.firstName,
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      gender: [user.gender, { validators: [Validators.required] }],
      id: [user.id, { validators: [Validators.required] }],
      lastName: [
        user.lastName,
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      nationality: [
        user.nationality,
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      phoneNumber: [
        user.phoneNumber,
        { validators: [Validators.required, phoneNumberValidator()] },
      ],
    });
  }
}

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
