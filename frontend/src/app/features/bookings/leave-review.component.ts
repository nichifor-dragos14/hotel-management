import { PropertyDetails, ReviewService } from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
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
import { StarRatingModule, StarRatingConfigService } from 'angular-star-rating';

@Injectable()
export class CustomConfigService extends StarRatingConfigService {
  constructor() {
    super();
    this.numOfStars = 10;
    this.staticColor = 'ok';
    this.size = 'large';
    this.labelPosition = 'left';
  }
}

@Component({
  selector: 'app-leave-review',
  standalone: true,
  template: `
    <app-page-header title="Your review for {{ property.name }} 🌟">
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
      <p class="font-light">
        Let us know how your stay was! We love hearing what you liked and what
        we can do better. Your review makes all the difference. 😄
      </p>

      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
        <mat-error>The title is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <editor appTinyEditor formControlName="description" />
        <mat-error>The description is required</mat-error>
      </mat-form-field>

      <section role="rating">
        <span>
          🚀 Your rating is {{ reviewForm.get(['rating'])!.value | json }}
        </span>
        <star-rating-control formControlName="rating"></star-rating-control>
      </section>
    </form>
  `,
  styles: `
    :host {
      padding: 32px 24px;
      width: 56vw;
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
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 32px;
    }
    
    .font-light {
      font-weight: lighter;
      font-size: 0.8rem;
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
    StarRatingModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: StarRatingConfigService,
      useClass: CustomConfigService,
    },
  ],
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
      this.toastService.open('Your review was successfully sent', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
    }
  }
}
