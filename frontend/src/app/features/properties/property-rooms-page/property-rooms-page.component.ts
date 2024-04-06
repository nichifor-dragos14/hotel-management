import { PropertyService } from '$backend/services';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { RoomCardComponent } from '$shared/cards';
import { PaginatedDataSource } from '$core/pagination';
import { ReviewCardPlaceholderComponent } from '$shared/placeholders/card-placeholder/review-card-placeholder.component';

@Component({
  selector: 'app-property-rooms-page',
  standalone: true,
  templateUrl: './property-rooms-page.component.html',
  styleUrls: ['./property-rooms-page.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    RoomCardComponent,
    ReviewCardPlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyRoomsPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);

  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  roomsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdRoomsGet({
        from: from,
        to: to,
        id: this.activatedRoute.snapshot.parent?.parent?.params['id'],
      }),
  });
}
