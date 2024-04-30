import { CreateBookingCommand, UserDetailsForBooking } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CreateBookingFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(booking: CreateBookingCommand): FormGroup {
    return this.formBuilder.group<CreateBookingCommand>({
      endDate: [
        booking.endDate,
        { validators: [Validators.required, afterTomorrow()] },
      ],
      expectedArrival: [
        booking.expectedArrival,
        { validators: [Validators.required] },
      ],
      loggedUserId: [
        booking.loggedUserId,
        { validators: [Validators.required] },
      ],
      roomId: [booking.roomId, { validators: [Validators.required] }],
      specialMentions: [
        booking.specialMentions,
        { validators: [Validators.required, Validators.maxLength(500)] },
      ],
      startDate: [
        booking.startDate,
        { validators: [Validators.required, afterToday()] },
      ],
      totalPrice: [booking.totalPrice, { validators: [Validators.required] }],
      userDetails: [booking.userDetails, { validators: [Validators.required] }],
    });
  }
}

@Injectable({ providedIn: 'root' })
export class CreateBookingUserFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(userDetails: UserDetailsForBooking): FormGroup {
    return this.formBuilder.group<UserDetailsForBooking>({
      country: [
        userDetails.country,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      email: [
        userDetails.email,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      firstName: [
        userDetails.firstName,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      lastName: [
        userDetails.lastName,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      phoneNumber: [
        userDetails.phoneNumber,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
    });
  }
}

export function afterToday(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();

    const inputDate = new Date(control.value);

    if (inputDate >= today) {
      return null;
    }

    return { afterToday: { value: control.value } };
  };
}

export function afterTomorrow(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inputDate = new Date(control.value);

    if (inputDate >= tomorrow) {
      return null;
    }

    return { afterTomorrow: { value: control.value } };
  };
}
