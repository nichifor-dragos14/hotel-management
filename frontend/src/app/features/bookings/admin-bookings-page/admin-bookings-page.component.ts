import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { BookingService, PropertyService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { MatTabsModule } from '@angular/material/tabs';
import { DateConverterModule } from '$shared/date-converter';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-bookings-page',
  templateUrl: './admin-bookings-page.component.html',
  styleUrls: ['./admin-bookings-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    MatTabsModule,
    DateConverterModule,
    MatIconModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBookingsPageComponent {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly propertyService = inject(PropertyService);

  @Input() propertyId!: string;

  pastBookingsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdBookingsPastGet({
        id: this.propertyId,
        from,
        to,
      }),
  });

  upcomingBookingsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdBookingsUpcomingGet({
        id: this.propertyId,
        from,
        to,
      }),
  });
}
