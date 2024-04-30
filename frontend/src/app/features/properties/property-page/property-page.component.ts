import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { PropertyDetails, RoomType } from '$backend/services';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { ReviewPropertyCardComponent } from '$shared/cards';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SEARCH_PROPERTY_FORM } from '$features/main-page/search-property.form';
import { MatCardModule } from '@angular/material/card';
import { GoogleMapsPreviewComponent } from '$shared/google-maps';

export interface GridImage {
  image: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-property-page',
  templateUrl: './property-page.component.html',
  styleUrls: ['./property-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    AppPageHeaderComponent,
    MatGridListModule,
    MatTableModule,
    ReviewPropertyCardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    GoogleMapsPreviewComponent,
  ],
})
export class PropertyPageComponent implements OnInit {
  @Input() property!: PropertyDetails;
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  searchPropertyForm = inject(SEARCH_PROPERTY_FORM);

  displayedColumns = ['roomType', 'numberOfGuests', 'price'];

  gridImages: GridImage[] = [];
  gridCols = 0;

  minDate: Date = new Date();
  maxDate: Date = new Date();

  constructor() {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
    this.maxDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    if (this.property.imageUrls.length === 1) {
      this.gridCols = 1;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 3 },
      ];
    }

    if (this.property.imageUrls.length === 2) {
      this.gridCols = 2;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 3 },
        { image: this.property.imageUrls[1], cols: 1, rows: 3 },
      ];
    }

    if (this.property.imageUrls.length === 3) {
      this.gridCols = 2;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 1 },
        { image: this.property.imageUrls[1], cols: 1, rows: 3 },
        { image: this.property.imageUrls[2], cols: 1, rows: 2 },
      ];
    }

    if (this.property.imageUrls.length === 4) {
      this.gridCols = 2;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 1 },
        { image: this.property.imageUrls[1], cols: 1, rows: 2 },
        { image: this.property.imageUrls[2], cols: 1, rows: 2 },
        { image: this.property.imageUrls[3], cols: 1, rows: 1 },
      ];
    }

    if (this.property.imageUrls.length === 5) {
      this.gridCols = 3;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 1 },
        { image: this.property.imageUrls[1], cols: 2, rows: 2 },
        { image: this.property.imageUrls[2], cols: 1, rows: 1 },
        { image: this.property.imageUrls[3], cols: 2, rows: 1 },
        { image: this.property.imageUrls[4], cols: 1, rows: 1 },
      ];
    }

    if (this.property.imageUrls.length === 6) {
      this.gridCols = 4;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 1, rows: 1 },
        { image: this.property.imageUrls[1], cols: 3, rows: 2 },
        { image: this.property.imageUrls[2], cols: 1, rows: 1 },
        { image: this.property.imageUrls[3], cols: 2, rows: 1 },
        { image: this.property.imageUrls[4], cols: 1, rows: 1 },
        { image: this.property.imageUrls[5], cols: 1, rows: 1 },
      ];
    }

    if (this.property.imageUrls.length >= 7) {
      this.gridCols = 4;
      this.gridImages = [
        { image: this.property.imageUrls[0], cols: 2, rows: 1 },
        { image: this.property.imageUrls[1], cols: 2, rows: 2 },
        { image: this.property.imageUrls[2], cols: 2, rows: 1 },
        { image: this.property.imageUrls[3], cols: 1, rows: 1 },
        { image: this.property.imageUrls[4], cols: 1, rows: 1 },
        { image: this.property.imageUrls[5], cols: 1, rows: 1 },
        { image: this.property.imageUrls[6], cols: 1, rows: 1 },
      ];
    }
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

  transformToOneDecimal(rating: number) {
    return rating.toPrecision(2);
  }

  transformReviewRatingToString(rating: number) {
    if (rating >= 9) return 'Superb';
    if (rating >= 8) return 'Very good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Pleasant';

    return '👍';
  }

  sendParams() {
    let queryParams = {
      location: this.searchPropertyForm.value.location,
      startDate: this.searchPropertyForm.value.startDate?.toISOString(),
      endDate: this.searchPropertyForm.value.endDate?.toISOString(),
      numberOfAdults: this.searchPropertyForm.value.numberOfAdults,
      numberOfChildren: this.searchPropertyForm.value.numberOfChildren,
      numberOfRooms: this.searchPropertyForm.value.numberOfRooms,
    };

    if (
      queryParams.location ==
      this.activatedRoute.snapshot.queryParams['location']
    ) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: queryParams,
      });

      return;
    }

    this.router.navigate(['/main/search-results'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
    });
  }
}
