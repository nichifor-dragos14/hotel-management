import { UpdateBookingCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class UpdateBookingFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(booking: UpdateBookingCommand): FormGroup {
    return this.formBuilder.group<UpdateBookingCommand>({
      expectedArrival: [booking.expectedArrival],
      id: [booking.id, { validators: [Validators.required] }],
      specialMentions: [
        booking.specialMentions,
        { validators: [Validators.maxLength(500)] },
      ],
      userId: [booking.userId, { validators: [Validators.required] }],
    });
  }
}
