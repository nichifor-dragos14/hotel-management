import { ReviewPropertyDetails } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateConverterModule } from '$shared/date-converter';

@Component({
  selector: 'app-review-property-card',
  template: `
    <mat-card>
      <section role="review">
        <mat-card-header>
          <section role="user-and-picture">
            <img matCardAvatar [src]="[review.user!.profilePicture]" />

            <section role="user">
              <span matCardTitle>
                @if (review.user) {
                  {{ review.user.firstName }} {{ review.user.lastName }}
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

        <mat-card-content class="font-light">
          <span matCardSubtitle>{{ review.title }}</span>
          <p [innerHTML]="transformText(review.description)"></p>
        </mat-card-content>
      </section>

      <div class="property-rating-square">
        {{ transformToTwoDecimals(review.rating) }}
      </div>

      <span class="date font-light">{{ review.createdOn | dateFormat }}</span>
    </mat-card>
  `,
  styles: `
    mat-card {
        display: grid;
        grid-template-areas: 'review rating' 'review date';
        grid-template-columns: 1fr auto;
        gap: 8px;
        padding: 8px;
        border-radius: 0 !important;
        height: 200px;
        width: calc(90vw / 4);
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    section[role='review'] {
        grid-area: review;
        display: flex;
        flex-direction: column;
        gap: 16px;
        overflow: hidden
    }

    section[role='user-and-picture'] {
        display: flex;
        flex-direction: row;
        flex-wrap: unset;
        align-items: center;
        gap: 16px;
    }

    p {
        max-width: 170px;
    }

    section[role='user-and-picture'] img {
        margin-bottom: 0 !important;
    }

    section[role='user'] {
        display: flex;
        flex-direction: column;
    }

    .property-rating-square {
        grid-area: rating;
        justify-self: end;
        background-color: #5e35b1;
        color: white;
        display: inline;
        padding: 8px;
        height: min-content;
        width: min-content;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .date {
      grid-area: date;
      justify-self: end;
      align-self: end;
      color: grey;
    }

    .font-light {
      font-size: 0.8rem;
      color: grey;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, CommonModule, RouterModule, DateConverterModule],
})
export class ReviewPropertyCardComponent {
  @Input() review!: ReviewPropertyDetails;

  transformText(text: string) {
    if (text.length > 100) {
      return text.slice(0, 100) + '...';
    }

    return text;
  }

  transformToTwoDecimals(rating: number) {
    return rating.toPrecision(2);
  }
}
