import { PropertySummaryFiltered, Review } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-review-card',
  template: `
    <mat-card>
      <section role="review">
        <mat-card-header>
          <section role="information-picture">
            <img matCardAvatar src="assets/hotel1.jpg" />

            <section role="information">
              <span matCardTitle> John Arnold </span>
              <span matCardSubtitle>🎏 Italy</span>
            </section>
          </section>
        </mat-card-header>

        <mat-card-content>
          <span>"{{ review.description }}"</span>
        </mat-card-content>
      </section>

      <div class="property-rating-square">
        {{ review.rating }}
      </div>
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
  imports: [MatCardModule, MatIconModule, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  @Input() review!: Review;
}
