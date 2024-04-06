import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AppLinePlaceholderComponent } from '../line-placeholder';
import { AppCirclePlaceholderComponent } from '../circle-placeholder';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-room-card-placeholder',
  template: `
    <mat-card>
      <section role="content">
        <mat-card-header>
          <app-line-placeholder [height]="30" [width]="200">
          </app-line-placeholder>
        </mat-card-header>

        <mat-card-content>
          <section role="capacity">
            <app-line-placeholder [height]="20" [width]="150">
            </app-line-placeholder>

            <app-line-placeholder [height]="20" [width]="150">
            </app-line-placeholder>
          </section>

          <app-line-placeholder [height]="25" [width]="700">
          </app-line-placeholder>
        </mat-card-content>
      </section>

      <section role="book">
        <app-line-placeholder [height]="30" [width]="80">
        </app-line-placeholder>

        <button mat-button color="primary" disabled>reserve</button>
      </section>
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
        grid-template-areas: 'content book';
        padding: 8px;
        border-radius: 0 !important;
        height: 164px;
    }

    section[role="content"] {
        grid-area: content;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    section[role="book"] {
        grid-area: book;
    }
    
    mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    mat-card-content section[role="capacity"] {
        display: flex;
        flex-direction: column;
        gap: 4px;
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
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    MatButtonModule,
  ],
})
export class RoomCardPlaceholderComponent {}
