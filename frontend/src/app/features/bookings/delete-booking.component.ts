import { BookingService, ReportService } from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-close-booking',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Delete booking?</h1>
    <p mat-dialog-content>Are you sure you want to delete this booking?</p>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="ok()">Ok</button>
      <button mat-button color="warn" routerLink="../../">Close</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBookingComponent {
  readonly bookingService = inject(BookingService);
  readonly router = inject(Router);
  readonly toastService = inject(AppToastService);

  @Input() id: string = '';

  async ok() {
    try {
      await this.bookingService.bookingsIdDeleteAsync({
        id: this.id,
      });
      this.toastService.open('Successfully deleted booking', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/bookings/reinit');
    }
  }
}
