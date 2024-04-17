import { UpdateReviewCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class UpdateReviewFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(review: UpdateReviewCommand): FormGroup {
    return this.formBuilder.group<UpdateReviewCommand>({
      description: [review.description, { validators: [Validators.required] }],
      id: [review.id, { validators: [Validators.required] }],
      title: [review.title, { validators: [Validators.required] }],
      rating: [review.rating, { validators: [Validators.required] }],
    });
  }
}
