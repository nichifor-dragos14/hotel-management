import { UpdateUserDetailsCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditUserDetailsFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(user: UpdateUserDetailsCommand): FormGroup {
    return this.formBuilder.group<UpdateUserDetailsCommand>({
      address: [user.address, { validators: [Validators.required] }],
      dateOfBirth: [user.dateOfBirth, { validators: [Validators.required] }],
      firstName: [user.firstName, { validators: [Validators.required] }],
      gender: [user.gender, { validators: [Validators.required] }],
      id: [user.id, { validators: [Validators.required] }],
      lastName: [user.lastName, { validators: [Validators.required] }],
      nationality: [user.nationality, { validators: [Validators.required] }],
      phoneNumber: [user.phoneNumber, { validators: [Validators.required] }],
    });
  }
}
