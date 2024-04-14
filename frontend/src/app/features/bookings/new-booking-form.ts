import { CreateBookingCommand, UserDetailsForBooking } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class CreateBookingFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(booking: CreateBookingCommand): FormGroup {
    return this.formBuilder.group<CreateBookingCommand>({
      endDate: [booking.endDate, { validators: [Validators.required] }],
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
        { validators: [Validators.required] },
      ],
      startDate: [booking.startDate, { validators: [Validators.required] }],
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
      country: [userDetails.country, { validators: [Validators.required] }],
      email: [userDetails.email, { validators: [Validators.required] }],
      firstName: [userDetails.firstName, { validators: [Validators.required] }],
      lastName: [userDetails.lastName, { validators: [Validators.required] }],
      phoneNumber: [
        userDetails.phoneNumber,
        { validators: [Validators.required] },
      ],
    });
  }
}
