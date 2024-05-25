import { CreateReviewCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class LeaveReviewFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(review: CreateReviewCommand): FormGroup {
    return this.formBuilder.group<CreateReviewCommand>({
      description: [
        review.description,
        { validators: [Validators.required, Validators.maxLength(1000)] },
      ],
      propertyId: [review.propertyId, { validators: [Validators.required] }],
      rating: [
        review.rating,
        {
          validators: [
            Validators.required,
            Validators.max(10),
            Validators.min(1),
          ],
        },
      ],
      title: [
        review.title,
        { validators: [Validators.required, Validators.maxLength(100)] },
      ],
      userId: [review.userId, { validators: [Validators.required] }],
      bookingId: [review.bookingId, { validators: [Validators.required] }],
    });
  }
}
