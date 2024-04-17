import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ReviewService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { CommonModule } from '@angular/common';
import { DateConverterModule } from '$shared/date-converter';

@Component({
  selector: 'app-reviews-page',
  templateUrl: './reviews-page.component.html',
  styleUrls: ['./reviews-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    CommonModule,
    DateConverterModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsPageComponent {
  reviewService = inject(ReviewService);

  @Input() userId!: string;

  reviewsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.reviewService.reviewsGet({ from, to, userId: this.userId }),
  });

  getColor(rating: number): string {
    console.log(rating);
    if (rating >= 1 && rating <= 2) {
      console.log(rating);
      return 'red';
    } else if (rating >= 3 && rating <= 4) {
      return 'lightcoral';
    } else if (rating >= 5 && rating <= 6) {
      return 'orange';
    } else if (rating >= 7 && rating <= 8) {
      return 'lightgreen';
    } else {
      return 'green';
    }
  }
}
