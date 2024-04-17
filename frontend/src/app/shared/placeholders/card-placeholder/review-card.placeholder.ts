import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AppLinePlaceholderComponent } from '../line-placeholder';
import { AppCirclePlaceholderComponent } from '../circle-placeholder';

@Component({
  selector: 'app-review-card-placeholder',
  template: `
    <mat-card>
      <section role="review">
        <mat-card-header>
          <section role="user-and-picture">
            <app-circle-placeholder [radius]="40"></app-circle-placeholder>

            <section role="user">
              <span matCardTitle class="name">
                <app-line-placeholder [width]="90" [height]="20">
                </app-line-placeholder>

                <app-line-placeholder [width]="80" [height]="20">
                </app-line-placeholder>
              </span>

              <span matCardSubtitle>
                <app-line-placeholder [width]="100" [height]="15">
                </app-line-placeholder>
              </span>
            </section>
          </section>
        </mat-card-header>

        <mat-card-content>
          <span>
            <app-line-placeholder [width]="500" [height]="18">
            </app-line-placeholder>
          </span>
        </mat-card-content>
      </section>

      <div class="property-rating-square linear-background">9.0</div>

      <span class="date">
        <app-line-placeholder [width]="100" [height]="15">
        </app-line-placeholder>
      </span>
    </mat-card>
  `,
  styles: `
    .linear-background {
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #f6f7f8;
        background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
        background-size: 1000px 104px;
        position: relative;
        overflow: hidden;
    } 

    mat-card {
        display: grid;
        grid-template-areas: 'review rating' 'review date';
        grid-template-columns: 1fr auto;
        gap: 8px;
        padding: 8px;
        height: 155px;
    }

    section[role='review'] {
        grid-area: review;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    section[role='user-and-picture'] {
        display: flex;
        flex-direction: row;
        flex-wrap: unset;
        align-items: center;
        gap: 8px;
    }

    section[role='user-and-picture'] img {
        margin-bottom: 0 !important;
    }

    section[role='user'] {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    section[role='user'] .name {
        display: flex;
        flex-direction: row;
        gap: 8px;
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
  imports: [
    MatCardModule,
    CommonModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
  ],
})
export class ReviewCardPlaceholderComponent {}
