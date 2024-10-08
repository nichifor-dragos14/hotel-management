import { CreateReportCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class LeaveReportFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(review: CreateReportCommand): FormGroup {
    return this.formBuilder.group<CreateReportCommand>({
      description: [
        review.description,
        { validators: [Validators.required, Validators.maxLength(500)] },
      ],
      propertyId: [review.propertyId, { validators: [Validators.required] }],
      title: [
        review.title,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      userId: [review.userId, { validators: [Validators.required] }],
      bookingId: [review.bookingId, { validators: [Validators.required] }],
    });
  }
}
