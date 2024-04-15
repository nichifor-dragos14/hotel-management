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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatChipsModule } from '@angular/material/chips';
import { DateConverterModule } from '$shared/date-converter';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

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
    MatSlideToggleModule,
    AppPageHeaderComponent,
    MatChipsModule,
    DateConverterModule,
    MatDividerModule,
    CommonModule,
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

  ngAfterViewInit() {
    console.log(this.bookingDetails, this.bookingForm);
  }

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

  async updateBooking(newBooking: typeof this.bookingForm.value) {
    //   try {
    //     await this.propertyService.propertiesPatchAsync({
    //       body: {
    //         id,
    //         name,
    //         description,
    //         email,
    //         phoneNumber,
    //         hasBreakfast,
    //         hasFitnessCenter,
    //         hasFreeCancellation,
    //         hasFreeWiFi,
    //         hasParking,
    //         hasPetFriendlyPolicy,
    //         hasPool,
    //         hasRestaurant,
    //         hasRoomService,
    //       },
    //     });
    //     this.toastService.open('Successfully updated property', 'info');
    //   } catch (error) {
    //     if (error instanceof Error) {
    //       this.toastService.open(error.message, 'error');
    //     }
    //   } finally {
    //     await this.router.navigateByUrl('/properties/reinit');
    //   }
  }
}
