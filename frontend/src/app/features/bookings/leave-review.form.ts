import { CreateReviewCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class LeaveReviewFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(review: CreateReviewCommand): FormGroup {
    return this.formBuilder.group<CreateReviewCommand>({
      description: [review.description, { validators: [Validators.required] }],
      propertyId: [review.propertyId, { validators: [Validators.required] }],
      rating: [review.rating, { validators: [Validators.required] }],
      title: [review.title, { validators: [Validators.required] }],
      userId: [review.userId, { validators: [Validators.required] }],
    });
  }
}
