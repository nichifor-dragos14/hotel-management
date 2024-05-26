import { BookingDetails, BookingService, RoomType } from '$backend/services';
import { AppToastService } from '$shared/toast';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatSelectModule } from '@angular/material/select';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatChipsModule } from '@angular/material/chips';
import { DateConverterModule } from '$shared/date-converter';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { GoogleMapsPreviewComponent } from '$shared/google-maps';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-update-booking-page',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    TinyEditorModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    AppPageHeaderComponent,
    MatChipsModule,
    DateConverterModule,
    MatDividerModule,
    CommonModule,
    GoogleMapsPreviewComponent,
    MatCardModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateBookingPageComponent {
  readonly bookingService = inject(BookingService);
  readonly toastService = inject(AppToastService);
  readonly router = inject(Router);

  @Input() bookingDetails!: BookingDetails;
  @Input() bookingForm!: FormGroup;

  generateStarRating(rating: number): string {
    const stars = '⭐'.repeat(rating);
    return stars;
  }

  roomTypeMapper(value: RoomType): string {
    if (value == RoomType.$0) {
      return 'Single';
    }

    if (value == RoomType.$1) {
      return 'Double';
    }

    if (value == RoomType.$2) {
      return 'Suite';
    }

    if (value == RoomType.$3) {
      return 'Deluxe';
    }

    return '';
  }

  isInPast() {
    return this.bookingDetails.endDate <= new Date().toISOString();
  }

  async updateBooking(newBooking: typeof this.bookingForm.value) {
    if (this.bookingForm.invalid) {
      return;
    }

    try {
      await this.bookingService.bookingsPatchAsync({
        body: {
          id: newBooking.id,
          expectedArrival: newBooking.expectedArrival,
          specialMentions: newBooking.specialMentions,
          userId: newBooking.userId,
        },
      });
      this.toastService.open('Successfully updated booking details', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/bookings/my-reservations');
    }
  }
}
