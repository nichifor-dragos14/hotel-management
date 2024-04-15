import { UpdateBookingCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class UpdateBookingFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(booking: UpdateBookingCommand): FormGroup {
    return this.formBuilder.group<UpdateBookingCommand>({
      expectedArrival: [
        booking.expectedArrival,
        { validators: [Validators.required] },
      ],
      id: [booking.id, { validators: [Validators.required] }],
      specialMentions: [booking.specialMentions],
    });
  }
}
