import { PropertyService } from '$backend/services';
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
  selector: 'app-delete-property',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Delete property?</h1>

    <p mat-dialog-content>Are you sure you want to delete this property?</p>

    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="ok()">Ok</button>
      <button mat-button color="warn" routerLink="../../">Close</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePropertyComponent {
  readonly router = inject(Router);
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);

  @Input() id: string = '';

  async ok() {
    try {
      await this.propertyService.propertiesIdDeleteAsync({ id: this.id });
      this.toastService.open('The property was deleted successfully', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/properties/reinit');
    }
  }
}
