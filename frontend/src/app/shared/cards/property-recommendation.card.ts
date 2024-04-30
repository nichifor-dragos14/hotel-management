import { PropertySummaryRecommendation } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-property-recommendation-card',
  template: `
    <mat-card matRipple>
      <div class="image-container">
        <img matCardImage [src]="property.imageUrl" alt="Property picture" />
      </div>

      <section role="information">
        <mat-card-header>
          <span matCardTitle>
            {{ generateStarRating(property.rating) }}
          </span>

          <span matCardSubtitle>
            <a
              href="https://www.google.com/maps/place/{{ property.location }}"
              target="_blank"
              (click)="preventNavigation($event)"
            >
              {{ property.location }}
            </a>
            ·
            <a
              href="https://www.google.com/maps/place/{{ property.location }}"
              target="_blank"
              (click)="preventNavigation($event)"
            >
              Show on map
            </a>
          </span>

          <span
            matCardSubtitle
            *ngFor="let room of property.typeOfRooms.slice(0, 2)"
          >
            {{ transformTypeOfRoomToString(room) }} room
          </span>
        </mat-card-header>

        <mat-card-content>
          @if (property.hasFreeCancellation) {
            <span matCardSubtitle class="green-text">
              <mat-icon>check</mat-icon>
              Free cancellation
            </span>
          }
          @if (!property.prepaymentNeeded) {
            <span matCardSubtitle class="green-text">
              <mat-icon>check</mat-icon>
              No prepayment needed - pay at arrival
            </span>
          }
        </mat-card-content>
      </section>

      <section role="rating-and-price">
        <mat-card-header>
          <span matCardTitle id="review-rating">
            @if (property.reviewRating) {
              {{ transformReviewRatingToString(property.reviewRating!) }}
              <div class="property-rating-square">
                {{ transformToTwoDecimals(property.reviewRating) }}
              </div>
            } @else {
              <div>No reviews yet 🤔</div>
            }
          </span>
          <span matCardSubtitle>
            {{ property.totalReviews }}
            @if (property.totalReviews == 1) {
              review
            } @else {
              reviews
            }
          </span>
        </mat-card-header>

        <mat-card-content>
          <span matCardSubtitle> Click to see available dates </span>
        </mat-card-content>
      </section>
    </mat-card>
  `,
  styles: `
    mat-card {
        padding: 24px;
        display: grid;
        grid-template-columns: min-content 1fr 1fr;
        gap: 16px;
    }

    mat-icon {
      overflow: unset;
    }

    .image-container {
        width: 200px;
        height: 200px;
        overflow: hidden;
        border-radius: 8px;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    section[role='information'] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    section[role='information'] mat-card-header {
        display: flex;
        flex-direction: column;
    }

    section[role='information'] mat-card-content span {
        display: flex;
        justify-items: center;
        align-items: center;
        gap: 8px;
    }

    section[role='rating-and-price'] {
        justify-self: end;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: end;
    }

    section[role='rating-and-price'] mat-card-header {
        align-self: end;
    }

    #review-rating {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }

    .property-rating-square {
        background-color: #5e35b1;
        color: white;
        display: inline;
        padding: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .font-light {
      font-weight: lighter;
      font-size: 0.8rem;
    }

    .green-text {
        color: green;
    }

    .red-text {
        color: red;
    }
  `,
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatRippleModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyRecommendationCardComponent {
  @Input() property!: PropertySummaryRecommendation;

  generateStarRating(rating: number): string {
    const stars = '⭐'.repeat(rating);

    return this.property.name + ' ' + stars;
  }

  transformTypeOfRoomToString(type: number) {
    if (type == 0) return 'Single';
    if (type == 1) return 'Double';
    if (type == 2) return 'Suite';
    if (type == 3) return 'Deluxe';

    return '';
  }

  transformReviewRatingToString(rating: number) {
    if (rating >= 9) return 'Superb';
    if (rating >= 8) return 'Very good';
    if (rating >= 7) return 'Good';
    if (rating >= 6) return 'Pleasant';

    return '👍';
  }

  transformToTwoDecimals(rating: number) {
    return rating.toPrecision(2);
  }

  preventNavigation(event: MouseEvent): void {
    event.stopPropagation();
  }
}
