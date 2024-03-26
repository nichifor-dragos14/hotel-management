import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { PropertyDetails, RoomType } from '$backend/services';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { ReviewCardComponent } from '$shared/cards';

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
    ReviewCardComponent,
  ],
})
export class PropertyPageComponent implements OnInit, AfterViewInit {
  @Input() property!: PropertyDetails;
  activatedRoute = inject(ActivatedRoute);

  displayedColumns = ['roomType', 'numberOfGuests', 'price'];

  gridImages: GridImage[] = [];
  imageSize = 7;
  gridCols = 0;

  ngOnInit(): void {
    if (this.imageSize === 1) {
      this.gridCols = 1;
      this.gridImages = [{ image: 'assets/hotel1.jpg', cols: 1, rows: 3 }];
    }

    if (this.imageSize === 2) {
      this.gridCols = 2;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 1, rows: 3 },
        { image: 'assets/hotel2.jpg', cols: 1, rows: 3 },
      ];
    }

    if (this.imageSize === 3) {
      this.gridCols = 2;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel2.jpg', cols: 1, rows: 3 },
        { image: 'assets/hotel3.jpg', cols: 1, rows: 2 },
      ];
    }

    if (this.imageSize === 4) {
      this.gridCols = 2;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 2 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 2 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
      ];
    }

    if (this.imageSize === 5) {
      this.gridCols = 3;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 2, rows: 2 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 2, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
      ];
    }

    if (this.imageSize === 6) {
      this.gridCols = 4;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel2.jpg', cols: 3, rows: 2 },
        { image: 'assets/hotel3.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 2, rows: 1 },
        { image: 'assets/hotel2.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel3.jpg', cols: 1, rows: 1 },
      ];
    }

    if (this.imageSize >= 7) {
      this.gridCols = 4;
      this.gridImages = [
        { image: 'assets/hotel1.jpg', cols: 2, rows: 1 },
        { image: 'assets/hotel2.jpg', cols: 2, rows: 2 },
        { image: 'assets/hotel3.jpg', cols: 2, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel2.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel3.jpg', cols: 1, rows: 1 },
        { image: 'assets/hotel1.jpg', cols: 1, rows: 1 },
      ];
    }
  }

  ngAfterViewInit(): void {
    console.log(this.property);
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
}
