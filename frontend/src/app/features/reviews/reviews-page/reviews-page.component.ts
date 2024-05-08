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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    CommonModule,
    DateConverterModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsPageComponent {
  readonly reviewService = inject(ReviewService);

  @Input() userId!: string;

  reviewsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.reviewService.reviewsGet({ from, to, userId: this.userId }),
  });
}
