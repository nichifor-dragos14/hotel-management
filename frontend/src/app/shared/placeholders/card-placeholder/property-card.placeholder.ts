import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppLinePlaceholderComponent } from '../line-placeholder';

@Component({
  selector: 'app-property-card-placeholder',
  template: `
    <mat-card>
      <div class="image-container linear-background"></div>

      <section role="information">
        <mat-card-header>
          <span>
            <app-line-placeholder [width]="200" [height]="20">
            </app-line-placeholder>

            <app-line-placeholder [width]="80" [height]="20">
            </app-line-placeholder>
          </span>

          <app-line-placeholder [width]="300" [height]="10">
          </app-line-placeholder>
        </mat-card-header>

        <mat-card-content>
          <app-line-placeholder [width]="260" [height]="10">
          </app-line-placeholder>

          <app-line-placeholder [width]="240" [height]="10">
          </app-line-placeholder>

          <app-line-placeholder [width]="220" [height]="10">
          </app-line-placeholder>
        </mat-card-content>
      </section>

      <section role="rating-and-price">
        <mat-card-header>
          <span id="review-rating">
            <app-line-placeholder [width]="30" [height]="10">
            </app-line-placeholder>

            <div class="property-rating-square linear-background">9.0</div>
          </span>
          <span>
            <app-line-placeholder
              [width]="80"
              [height]="10"
            ></app-line-placeholder>
          </span>
        </mat-card-header>

        <mat-card-content>
          <app-line-placeholder [width]="100" [height]="10">
          </app-line-placeholder>

          <app-line-placeholder [width]="140" [height]="10">
          </app-line-placeholder>

          <app-line-placeholder [width]="160" [height]="10">
          </app-line-placeholder>
        </mat-card-content>
      </section>
    </mat-card>
  `,
  styles: `
   @keyframes placeHolderShimmer {
        0%{
            background-position: -468px 0;
        }
        100%{
            background-position: 468px 0;
        }
    }

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

    section[role='information'] {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    section[role='information'] mat-card-header {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    section[role='information'] mat-card-header span {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    section[role='information'] mat-card-content {
        display: flex;
        flex-direction: column;
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
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    section[role='rating-and-price'] mat-card-content {
        align-self: end;
        align-items: end;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    #review-rating {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }

    .property-rating-square {
        background-color: purple;
        color: white;
        display: inline;
        padding: 8px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
  `,
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    AppLinePlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCardPlaceholderComponent {}
