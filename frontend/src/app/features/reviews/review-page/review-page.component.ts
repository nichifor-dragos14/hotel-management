import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  inject,
} from '@angular/core';
import { ReviewDetails, ReviewService } from '$backend/services';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TinyEditorModule } from '$shared/tiny-editor';
import { ReactiveFormsModule } from '@angular/forms';
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
  selector: 'app-review-page',
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss'],
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
export class ReviewPageComponent {
  readonly router = inject(Router);
  readonly reviewService = inject(ReviewService);
  readonly toastService = inject(AppToastService);

  @Input() review!: ReviewDetails;

  generateStarRating(rating: number): string {
    const stars = '⭐'.repeat(rating);
    return stars;
  }
}
