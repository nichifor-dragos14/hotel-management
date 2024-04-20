import { PropertyDetails, ReviewService } from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-leave-review',
  standalone: true,
  template: `
    <app-page-header title="Your review for {{ property.name }}  💯">
      <button
        mat-button
        color="primary"
        button
        [disabled]="reviewForm.invalid"
        (click)="createReview(reviewForm.value)"
      >
        Send
      </button>

      <button mat-button color="warn" routerLink="../../../" button>
        Close
      </button>
    </app-page-header>

    <form [formGroup]="reviewForm">
      <p>
        The property would like to know what went well and what not. Your review
        helps us improve customer experience! 😄
      </p>

      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
        <mat-error>The review title is required</mat-error>
      </mat-form-field>

      <section role="rating">
        <mat-label>Rating 🚀</mat-label>
        <mat-slider min="1" max="10" step="0.1" discrete>
          <input matSliderThumb formControlName="rating" />
        </mat-slider>
      </section>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <editor appTinyEditor formControlName="description" />
        <mat-error>The review description is required</mat-error>
      </mat-form-field>
    </form>
  `,
  styles: `
    :host {
      padding: 32px 24px;
      width: 72vw;
      height: 64vh;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 64px;
    }

    section[role='rating'] {
      display: flex;
      flex-direction: column;
    }
`,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    AppPageHeaderComponent,
    ReactiveFormsModule,
    TinyEditorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveReviewComponent {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly reviewService = inject(ReviewService);
  readonly toastService = inject(AppToastService);

  @Input() property!: PropertyDetails;
  @Input() reviewForm!: FormGroup;

  async createReview(newReview: typeof this.reviewForm.value) {
    if (this.reviewForm.invalid) {
      return;
    }

    try {
      await this.reviewService.reviewsPostAsync({ body: newReview });
      this.toastService.open('Successfully posted review', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
    }
  }
}
