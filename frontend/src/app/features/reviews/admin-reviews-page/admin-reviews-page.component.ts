import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { PropertyService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { CommonModule } from '@angular/common';
import { DateConverterModule } from '$shared/date-converter';

@Component({
  selector: 'app-admin-reviews-page',
  templateUrl: './admin-reviews-page.component.html',
  styleUrls: ['./admin-reviews-page.component.scss'],
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
export class AdminReviewsPageComponent {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly propertyService = inject(PropertyService);

  @Input() propertyId!: string;

  reviewsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdReviewsGet({
        from,
        to,
        id: this.propertyId,
      }),
  });
}
