import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { PropertyCardComponent } from '$shared/cards';
import { PropertyService } from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';

@Component({
  selector: 'app-main-page-properties-list',
  templateUrl: './main-page-properties-list.component.html',
  styleUrls: ['./main-page-properties-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    RouterModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    PropertyCardComponent,
    ScrollingModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
  ],
})
export class MainPagePropertiesListComponent {
  propertyService = inject(PropertyService);
  activatedRoute = inject(ActivatedRoute);

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => {
      return this.propertyService.propertiesFilterLocationStartDateEndDateNumberOfAdultsNumberOfChildrenNumberOfRoomsGet(
        {
          from,
          to,
          location: this.activatedRoute.snapshot.queryParams['location'],
          startDate: this.activatedRoute.snapshot.queryParams['startDate'],
          endDate: this.activatedRoute.snapshot.queryParams['endDate'],
          numberOfAdults:
            this.activatedRoute.snapshot.queryParams['numberOfAdults'],
          numberOfChildren:
            this.activatedRoute.snapshot.queryParams['numberOfChildren'],
          numberOfRooms:
            this.activatedRoute.snapshot.queryParams['numberOfRooms'],
        }
      );
    },
  });
}
