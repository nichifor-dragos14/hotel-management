import { PropertyReview } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateConverterModule } from '$shared/date-converter';

@Component({
  selector: 'app-review-card',
  template: `
    <mat-card>
      <section role="review">
        <mat-card-header>
          <section role="user-and-picture">
            <img matCardAvatar [src]="[review.profilePicture]" />

            <section role="user">
              <span matCardTitle>
                {{ review.userFirstName }} {{ review.userLastName }}
              </span>

              <span matCardSubtitle> 🎏 {{ review.userNationality }} </span>
            </section>
          </section>
        </mat-card-header>

        <mat-card-content>
          <span>{{ transformText(review.title) }}</span>
          <span
            [innerHTML]="transformText(review.description)"
            matCardSubtitle
          ></span>
        </mat-card-content>
      </section>

      <div class="property-rating-square">
        {{ transformToTwoDecimals(review.rating) }}
      </div>

      <span class="date">{{ review.createdOn | dateFormat }}</span>
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
        height: 155px;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    p {
      overflow-wrap: break-word;
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
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, CommonModule, RouterModule, DateConverterModule],
})
export class ReviewCardComponent {
  @Input() review!: PropertyReview;

  transformText(text: string) {
    if (text.length > 183) {
      return text.slice(0, 180) + '...';
    }

    return text;
  }

  transformToTwoDecimals(rating: number) {
    return rating.toPrecision(2);
  }
}
