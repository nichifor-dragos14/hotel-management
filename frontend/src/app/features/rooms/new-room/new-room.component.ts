import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
  CreateRoomCommand,
  RoomService,
  RoomTypeSummary,
} from '$backend/services';
import { AppToastService } from '$shared/toast';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NEW_ROOM_FORM } from '../new-rooms.form';

@Component({
  selector: 'app-new-room-page',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
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
export class NewRoomPageComponent implements OnInit {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly roomService = inject(RoomService);
  readonly toastService = inject(AppToastService);
  readonly roomForm = inject(NEW_ROOM_FORM);

  @Input() roomTypes: RoomTypeSummary[] = [];

  ngOnInit() {
    this.roomForm.patchValue({
      propertyId: this.activatedRoute.snapshot.parent?.params['id'],
    });
  }

  async createRoom(newRoom: typeof this.roomForm.value) {
    if (this.roomForm.invalid) {
      return;
    }

    try {
      await this.roomService.roomsPostAsync({
        body: newRoom as CreateRoomCommand,
      });

      this.toastService.open('Successfully added room', 'info');
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
