import { RoomService } from '$backend/services';
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
import { LoginService } from '$features/auth/login.service';

@Component({
  selector: 'app-delete-room',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Delete room?</h1>

    <p mat-dialog-content>Are you sure you want to delete this room?</p>

    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="ok()">Ok</button>
      <button mat-button color="warn" routerLink="../../">Close</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule, CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRoomComponent {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly roomService = inject(RoomService);
  readonly toastService = inject(AppToastService);
  readonly loginService = inject(LoginService);

  @Input() id: string = '';

  async ok() {
    try {
      await this.roomService.roomsIdDeleteAsync({
        id: this.id,
        userId: this.loginService.getLoggedUserId(),
      });

      this.toastService.open('Successfully deleted room', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigate([
        '/rooms/reinit',
        this.activatedRoute.snapshot.parent?.parent?.parent?.params['id'],
      ]);
    }
  }
}
