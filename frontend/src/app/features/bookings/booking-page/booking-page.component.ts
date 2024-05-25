import {
  BookingAdminDetails,
  BookingDetails,
  BookingService,
  RoomType,
} from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
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
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
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
export class BookingPageComponent {
  readonly bookingService = inject(BookingService);

  @Input() booking!: BookingAdminDetails;

  isInPast() {
    return this.booking.endDate <= new Date().toISOString();
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
}
