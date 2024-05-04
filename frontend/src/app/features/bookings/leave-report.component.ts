import { PropertyDetails, ReportService } from '$backend/services';
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

@Component({
  selector: 'app-leave-report',
  standalone: true,
  template: `
    <app-page-header title="Your report for {{ property.name }} ⚠️">
      <button
        mat-button
        color="primary"
        button
        [disabled]="reportForm.invalid"
        (click)="createReport(reportForm.value)"
      >
        Send
      </button>

      <button mat-button color="warn" routerLink="../../../" button>
        Close
      </button>
    </app-page-header>

    <form [formGroup]="reportForm">
      <p class="font-light">
        We regret to learn that your reservation experience did not meet your
        expectations. We are eager to understand and address your concerns.
        Could you share with us the details of what happened? 🤕
      </p>

      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
        @if (reportForm.get('title')?.errors?.['required']) {
          <mat-error>The title is required.</mat-error>
        } @else if (reportForm.get('title')?.errors?.['maxlength']) {
          <mat-error> The title cannot be more than 30 characters. </mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <editor appTinyEditor formControlName="description" />
        @if (reportForm.get('description')?.errors?.['required']) {
          <mat-error>The description is required.</mat-error>
        } @else if (reportForm.get('description')?.errors?.['maxlength']) {
          <mat-error>
            The description cannot be more than 500 characters.
          </mat-error>
        }
      </mat-form-field>
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveReportComponent {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly reportService = inject(ReportService);
  readonly toastService = inject(AppToastService);

  @Input() property!: PropertyDetails;
  @Input() reportForm!: FormGroup;

  async createReport(newReport: typeof this.reportForm.value) {
    if (this.reportForm.invalid) {
      return;
    }

    try {
      await this.reportService.reportsPostAsync({ body: newReport });
      this.toastService.open('Your report was successfully sent', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
    }
  }
}
