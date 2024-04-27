import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { BookingService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { MatTabsModule } from '@angular/material/tabs';
import { DateConverterModule } from '$shared/date-converter';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bookings-page',
  templateUrl: './bookings-page.component.html',
  styleUrls: ['./bookings-page.component.scss'],
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
export class BookingsPageComponent {
  bookingService = inject(BookingService);

  @Input() userId!: string;

  pastBookingsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.bookingService.bookingsPastGet({ userId: this.userId, from, to }),
  });

  upcomingBookingsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.bookingService.bookingsUpcomingGet({
        userId: this.userId,
        from,
        to,
      }),
  });
}
