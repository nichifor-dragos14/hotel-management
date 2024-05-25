import { CreatePropertyCommand, PropertyType } from '$backend/services';
import { InjectionToken, inject } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';
import { LoginService } from '$features/auth/login.service';

export const NEW_PROPERTY_FORM = new InjectionToken('NEW_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () => {
    let loginService = inject(LoginService);

    return inject(AppFormBuilder).group<CreatePropertyCommand>({
      name: [
        '',
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      description: [
        '',
        { validators: [Validators.required, Validators.maxLength(1000)] },
      ],
      location: [
        '',
        { validators: [Validators.required, Validators.maxLength(50)] },
      ],
      email: ['', { validators: [Validators.required, Validators.email] }],
      phoneNumber: [
        '',
        { validators: [Validators.required, phoneNumberValidator()] },
      ],
      type: [PropertyType.$0, { validators: [Validators.required] }],
      hasBreakfast: [false, { validators: [Validators.required] }],
      hasFitnessCenter: [false, { validators: [Validators.required] }],
      hasFreeCancellation: [false, { validators: [Validators.required] }],
      hasFreeWiFi: [false, { validators: [Validators.required] }],
      hasParking: [false, { validators: [Validators.required] }],
      hasPetFriendlyPolicy: [false, { validators: [Validators.required] }],
      hasPool: [false, { validators: [Validators.required] }],
      hasRestaurant: [false, { validators: [Validators.required] }],
      hasRoomService: [false, { validators: [Validators.required] }],
      hasKitchen: [false, { validators: [Validators.required] }],
      prepaymentNeeded: [false, { validators: [Validators.required] }],
      rating: [
        3,
        {
          validators: [
            Validators.required,
            Validators.max(5),
            Validators.min(1),
          ],
        },
      ],
      pictureUrls: ['init', { validators: [Validators.required] }],
      userId: [
        loginService.getLoggedUserId(),
        { validators: [Validators.required] },
      ],
    });
  },
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
