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
    <app-page-header title="Your report for {{ property.name }} ❗">
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
      <p>
        We are sorry to hear that you are not happy with your reservation.
        Please, let us know what went wrong! 🤕
      </p>

      <mat-form-field appearance="outline">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
        <mat-error>The report title is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <editor appTinyEditor formControlName="description" />
        <mat-error>The report description is required</mat-error>
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
