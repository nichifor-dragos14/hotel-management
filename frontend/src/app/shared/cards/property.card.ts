import { PropertySummaryFiltered } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-card',
  template: `
    <mat-card>
      <div class="image-container">
        <img
          matCardImage
          src="https://material.angular.io/assets/img/examples/shiba2.jpg"
          alt="Photo of a Shiba Inu"
        />
      </div>

      <section role="information">
        <mat-card-header>
          <span matCardTitle>
            {{ property.name }}
            <ng-container *ngFor="let _ of [].constructor(property.rating)">
              ⭐
            </ng-container>
          </span>

          <span matCardSubtitle>
            <a href="#" target="_blank"> {{ property.location }} </a> ·
            <a href="#" target="_blank">Show on map </a>
          </span>

          <span matCardSubtitle>
            {{ transformTypeOfRoomToString(property.typeOfRoom) }} room
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
          @if (property.availableRooms <= 3) {
            <span matCardSubtitle class="red-text">
              Only {{ property.availableRooms }}
              @if (property.availableRooms == 1) {
                room
              } @else {
                rooms
              }
              left on our site at this price
            </span>
          }
        </mat-card-content>
      </section>

      <section role="rating-and-price">
        <mat-card-header>
          <span matCardTitle id="review-rating">
            {{ transformReviewRatingToString(property.reviewRating!) }}
            @if (property.reviewRating) {
              <div class="property-rating-square">
                {{ transformToTwoDecimals(property.reviewRating) }}
              </div>
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
          <span matCardSubtitle>
            {{ property.nightCount }}
            @if (property.nightCount == 1) {
              night
            } @else {
              nights
            }
            , {{ property.adultCount }}
            @if (property.adultCount == 1) {
              adult
            } @else {
              adults
            }
            @if (property.childCount == 1) {
              {{ property.childCount }} , 1 child
            } @else if (property.childCount > 1) {
              {{ property.childCount }} , {{ property.childCount }} children
            }
          </span>
          <span matCardTitle>{{ property.totalPrice }} lei</span>
          <span matCardSubtitle>Includes taxes and charges</span>
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

    .green-text {
        color: green;
    }

    .red-text {
        color: red;
    }
  `,
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCardComponent {
  @Input() property!: PropertySummaryFiltered;

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
}
