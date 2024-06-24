import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ReviewDetails } from '$backend/services';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-property-review-details',
  templateUrl: './property-review-details.component.html',
  styleUrls: ['./property-review-details.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule,
  ],
})
export class PropertyReviewComponent {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute)

  @Input() review!: ReviewDetails;

  generateStarRating(rating: number): string {
    const stars = '⭐'.repeat(rating);
    return stars;
  }
}
