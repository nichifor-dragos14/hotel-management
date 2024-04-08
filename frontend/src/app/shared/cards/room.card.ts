import { RoomPropertyDetails, RoomType } from '$backend/services';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-card',
  template: `
    <mat-card>
      <section role="content">
        <mat-card-header>
          <span matCardTitle>{{ roomTypeMapper(room.type) }} room</span>

          <section role="capacity">
            <span matCardSubtitle>
              <ng-container
                *ngFor="let _ of [].constructor(room.adultCapacity)"
              >
                <mat-icon>person</mat-icon>
              </ng-container>
              adults
            </span>

            <span
              matCardSubtitle
              [style.visibility]="
                room.childrenCapacity === 0 ? 'hidden' : 'visible'
              "
            >
              <ng-container
                *ngFor="let _ of [].constructor(room.childrenCapacity)"
              >
                <mat-icon>person</mat-icon>
              </ng-container>
              children
            </span>
          </section>
        </mat-card-header>

        <mat-card-content>
          @if (room.hasAirConditioning) {
            <span matCardSubtitle>
              <mat-icon>ac_unit</mat-icon>
              Air conditioning
            </span>
          }

          @if (room.hasBalcony) {
            <span matCardSubtitle>
              <mat-icon>deck</mat-icon>
              Balcony
            </span>
          }

          @if (room.hasHairdryer) {
            <span matCardSubtitle>
              <mat-icon>waves</mat-icon>
              Hairdryer
            </span>
          }

          @if (room.hasPrivateBathroom) {
            <span matCardSubtitle>
              <mat-icon>shower</mat-icon>
              Private bathroom
            </span>
          }

          @if (room.hasRefrigerator) {
            <span matCardSubtitle>
              <mat-icon>kitchen</mat-icon>
              Refrigerator
            </span>
          }

          @if (room.hasSeaView) {
            <span matCardSubtitle>
              <mat-icon>beach_access</mat-icon>
              Sea view
            </span>
          }

          @if (room.hasTowels) {
            <span matCardSubtitle>
              <mat-icon>local_laundry_service</mat-icon>
              Towels
            </span>
          }
        </mat-card-content>
      </section>

      <section role="book">
        <span matCardTitle>{{ room.price }} lei</span>

        <button mat-button color="primary">reserve</button>
      </section>
    </mat-card>
  `,
  styles: `
    mat-card {
        display: grid;
        grid-template-areas: 'content book';
        padding: 8px;
        border-radius: 0 !important;
        height: 164px;
    }

    section[role="content"] {
        grid-area: content;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    section[role="book"] {
        grid-area: book;
    }
    
    mat-card-header {
        display: flex;
        flex-direction: column;
        gap:4px;
    }

    mat-card-header span {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    
    mat-card-content {
        display: flex;
        flex-direction: row;
        gap: 16px;
    }

    mat-card-content span {
        display: flex;
        flex-direction: row;
        gap: 2px;
        align-items: center;
    }

    section[role='book'] {
        justify-self: end;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class RoomCardComponent {
  @Input() room!: RoomPropertyDetails;

  ngAfterViewInit() {
    console.log(this.room);
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
}
