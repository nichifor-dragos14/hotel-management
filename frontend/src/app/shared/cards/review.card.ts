import { ReviewPropertyDetails } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateConverterModule } from '$shared/date-converter';

@Component({
  selector: 'app-review-card',
  template: `
    <mat-card>
      <section role="review">
        <mat-card-header>
          <section role="information-picture">
            <img matCardAvatar src="assets/hotel1.jpg" />

            <section role="information">
              <span matCardTitle>
                @if (review.user) {
                  {{ review.user.lastName }} {{ review.user.firstName }}
                } @else {
                  Unknown
                }
              </span>
              <span matCardSubtitle>
                🎏
                @if (review.user) {
                  {{ review.user.nationality }}
                } @else {
                  Not specified
                }
              </span>
            </section>
          </section>
        </mat-card-header>

        <mat-card-content>
          <span>"{{ review.description }}"</span>
        </mat-card-content>
      </section>

      <section role="rating-date">
        <div class="property-rating-square">
          {{ transformToTwoDecimals(review.rating) }}
        </div>

        <span>{{ review.createdOn | dateFormat }}</span>
      </section>
    </mat-card>
  `,
  styles: `
    mat-card {
        display: grid;
        grid-template-areas: 'review rating';
        grid-template-columns: 1fr min-content;
        gap: 8px;
        padding: 8px;
    }

    section[role='review'] {
        grid-area: review;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    section[role='information-picture'] {
        display: flex;
        flex-direction: row;
        flex-wrap: unset;
        align-items: center;
        gap: 8px;
    }

    section[role='information-picture'] img {
        margin-bottom: 0 !important;
    }

    section[role='information'] {
        display: flex;
        flex-direction: column;
    }

    section[role='rating-date'] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .property-rating-square {
        grid-area: rating;
        background-color: #5e35b1;
        color: white;
        display: inline;
        padding: 8px;
        height: min-content;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    DateConverterModule,
  ],
})
export class ReviewCardComponent {
  @Input() review!: ReviewPropertyDetails;

  transformToTwoDecimals(rating: number) {
    return rating.toPrecision(2);
  }
}
