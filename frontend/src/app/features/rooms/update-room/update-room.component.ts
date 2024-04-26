import { RoomService } from '$backend/services';
import { AppToastService } from '$shared/toast';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-update-room-page',
  templateUrl: './update-room.component.html',
  styleUrls: ['./update-room.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateRoomPageComponent {
  readonly roomService = inject(RoomService);
  readonly toastService = inject(AppToastService);
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  @Input() roomForm!: FormGroup;

  async updateRoom(updatedRoom: typeof this.roomForm.value) {
    if (this.roomForm.invalid) {
      return;
    }
    try {
      await this.roomService.roomsPatchAsync({
        body: updatedRoom,
      });

      this.toastService.open('Successfully updated room', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigate([
        '/rooms/reinit',
        this.activatedRoute.snapshot.parent?.params['id'],
      ]);
    }
  }
}
