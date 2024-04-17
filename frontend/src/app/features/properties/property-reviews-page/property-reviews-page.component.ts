import { PropertyService } from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { ReviewCardComponent } from '$shared/cards';
import { PaginatedDataSource } from '$core/pagination';
import { ReviewCardPlaceholderComponent } from '$shared/placeholders/card-placeholder';

@Component({
  selector: 'app-property-reviews-page',
  standalone: true,
  templateUrl: './property-reviews-page.component.html',
  styleUrls: ['./property-reviews-page.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    ReviewCardComponent,
    ReviewCardPlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyReviewsPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);

  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  reviewsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdReviewsGet({
        from: from,
        to: to,
        id: this.activatedRoute.snapshot.parent?.parent?.params['id'],
      }),
  });
}
