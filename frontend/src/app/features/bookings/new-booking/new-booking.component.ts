import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatIconModule } from '@angular/material/icon';
import {
  BookingService,
  PropertyDetails,
  PropertyType,
  RoomPropertyDetails,
  RoomType,
  UserDetails,
} from '$backend/services';
import { MatCardModule } from '@angular/material/card';
import { DateConverterModule } from '$shared/date-converter';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AppPageHeaderComponent } from '$shared/page-header';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-new-booking-page',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    TinyEditorModule,
    MatIconModule,
    RouterModule,
    MatCardModule,
    DateConverterModule,
    CommonModule,
    MatDividerModule,
    MatRadioModule,
    FormsModule,
    TinyEditorModule,
    MatSelectModule,
    AppPageHeaderComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBookingPageComponent implements AfterViewInit {
  readonly router = inject(Router);
  readonly bookingService = inject(BookingService);
  readonly toastService = inject(AppToastService);

  @Input() property!: PropertyDetails;
  @Input() propertyRooms!: RoomPropertyDetails[];

  @Input() startDate!: Date;
  @Input() endDate!: Date;

  @Input() user!: UserDetails;
  @Input() userForm!: FormGroup;

  @Input() discount!: number;

  bookingForSomeoneElse: boolean = false;
  loggedUserEmail: string = '';
  expectedArrival: string = "I don't know";
  specialMentions: string = '';

  ngAfterViewInit() {
    this.setControls();

    this.loggedUserEmail = this.userForm.get('email')?.value;
  }

  propertyTypeMapper(propertyType: number) {
    if (propertyType == PropertyType.$0) {
      return 'Hotel';
    }

    if (propertyType == PropertyType.$1) {
      return 'Hostel';
    }

    if (propertyType == PropertyType.$2) {
      return 'Resort';
    }

    if (propertyType == PropertyType.$3) {
      return 'Campsite';
    }

    return '';
  }

  reviewRatingMapper(rating: number) {
    if (rating >= 9) return 'Superb';
    if (rating >= 8) return 'Very good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Pleasant';

    return '👍';
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

  transformToTwoDecimals(rating: number) {
    return rating.toFixed(2);
  }

  computeDateDifference(date1: any, date2: any): number {
    date1 = date1 instanceof Date ? date1 : new Date(date1);
    date2 = date2 instanceof Date ? date2 : new Date(date2);

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const differenceInMilliseconds = Math.abs(
      date2.getTime() - date1.getTime()
    );
    const differenceInDays = differenceInMilliseconds / millisecondsPerDay;

    return differenceInDays;
  }

  computeTotalPrice() {
    let nightCount = this.computeDateDifference(this.startDate, this.endDate);
    let totalPrice = 0;

    for (let room of this.propertyRooms) {
      totalPrice += room.price * nightCount;
    }

    return totalPrice;
  }

  computeTotalPriceDiscount() {
    const totalPrice = this.computeTotalPrice();

    return this.discount != 0
      ? totalPrice - (this.discount * totalPrice) / 100
      : totalPrice;
  }

  setControls() {
    if (!this.bookingForSomeoneElse) {
      this.userForm.get('firstName')?.disable();
      this.userForm.get('lastName')?.disable();
      this.userForm.get('email')?.disable();
      this.userForm.get('phoneNumber')?.disable();
      this.userForm.get('country')?.disable();
    } else {
      this.userForm.get('firstName')?.enable();
      this.userForm.get('lastName')?.enable();
      this.userForm.get('email')?.enable();
      this.userForm.get('phoneNumber')?.enable();
      this.userForm.get('country')?.enable();
    }
  }

  async createBooking(newBookingDetails: typeof this.userForm.value) {
    if (this.userForm.invalid || !this.startDate || !this.endDate) {
      return;
    }

    try {
      this.propertyRooms.forEach(async (room) => {
        let price =
          this.computeDateDifference(this.startDate, this.endDate) * room.price;

        if (this.discount != 0) {
          price = price - (price * this.discount) / 100;
        }

        await this.bookingService.bookingsPostAsync({
          body: {
            startDate: this.startDate.toString(),
            endDate: this.endDate.toString(),
            roomId: room.id,
            totalPrice: price,
            expectedArrival: this.expectedArrival,
            specialMentions: this.specialMentions,
            userDetails: newBookingDetails,
            loggedUserId: this.user.id,
          },
        });
      });
      this.toastService.open('Your booking was successful!', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/bookings/my-reservations');
    }
  }
}
