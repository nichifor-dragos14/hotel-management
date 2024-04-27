import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  inject,
} from '@angular/core';
import { ReviewService } from '$backend/services';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TinyEditorModule } from '$shared/tiny-editor';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppToastService } from '$shared/toast';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';

@Injectable()
export class CustomConfigService extends StarRatingConfigService {
  constructor() {
    super();
    this.numOfStars = 10;
    this.staticColor = 'ok';
    this.size = 'large';
    this.labelPosition = 'left';
  }
}

@Component({
  selector: 'app-update-review',
  templateUrl: './update-review.component.html',
  styleUrls: ['./update-review.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    TinyEditorModule,
    ReactiveFormsModule,
    StarRatingModule,
  ],
  providers: [
    {
      provide: StarRatingConfigService,
      useClass: CustomConfigService,
    },
  ],
})
export class UpdateReviewPageComponent {
  readonly router = inject(Router);
  readonly reviewService = inject(ReviewService);
  readonly toastService = inject(AppToastService);

  @Input() reviewForm!: FormGroup;

  async updateReview(updatedReview: typeof this.reviewForm.value) {
    if (this.reviewForm.invalid) {
      return;
    }

    try {
      await this.reviewService.reviewsPatchAsync({ body: updatedReview });
      this.toastService.open('Successfully updated your review', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/reviews/reinit');
    }
  }
}
