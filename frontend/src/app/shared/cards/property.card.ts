import { PropertyDetails } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
          <span matCardTitle>{{ property.name }} ⭐⭐⭐</span>
          <span matCardSubtitle>
            <a href="#" target="_blank"> {{ property.location }} </a> ·
            <a href="#" target="_blank">Show on map </a>
          </span>
        </mat-card-header>

        <mat-card-content>
          <span matCardSubtitle>Superior double room</span>
          <span matCardSubtitle>1 large double bed</span>
          <span matCardSubtitle class="green-text">
            <mat-icon>check</mat-icon>
            Free cancellation
          </span>
          <span matCardSubtitle class="green-text">
            <mat-icon>check</mat-icon>
            No prepayment needed - pay at arrival
          </span>
          <span matCardSubtitle class="red-text">
            Only three rooms left on our site at this price
          </span>
        </mat-card-content>
      </section>

      <section role="rating-and-price">
        <mat-card-header>
          <span matCardTitle>
            Fabulous
            <div class="property-rating-square">9.1</div>
          </span>
          <span matCardSubtitle>912 reviews</span>
        </mat-card-header>

        <mat-card-content>
          <span matCardSubtitle>2 nights, 2 adults</span>
          <span matCardTitle>1470 lei</span>
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

    .green-text {
        color: green;
    }

    .red-text {
        color: red;
    }
  `,
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCardComponent {
  @Input() property!: PropertyDetails;
}
