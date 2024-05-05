import { PropertyService } from '$backend/services';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { RoomCardComponent } from '$shared/cards';
import { PaginatedDataSource } from '$core/pagination';
import { RoomCardPlaceholderComponent } from '$shared/placeholders/card-placeholder';
import { LoginService } from '$features/auth/login.service';

@Component({
  selector: 'app-property-rooms-page',
  standalone: true,
  templateUrl: './property-rooms-page.component.html',
  styleUrls: ['./property-rooms-page.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    RoomCardComponent,
    RoomCardPlaceholderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyRoomsPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);
  readonly loginService = inject(LoginService);

  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  selectedRoomIds: string[] = [];

  roomsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) =>
      this.propertyService.propertiesIdRoomsGet({
        from: from,
        to: to,
        id: this.activatedRoute.snapshot.parent?.parent?.params['id'],
        startDate: this.activatedRoute.snapshot.queryParams['startDate'],
        endDate: this.activatedRoute.snapshot.queryParams['endDate'],
        numberOfAdults:
          this.activatedRoute.snapshot.queryParams['numberOfAdults'],
        numberOfChildren:
          this.activatedRoute.snapshot.queryParams['numberOfChildren'],
        loggedUserId: this.loginService.getLoggedUserId(),
      }),
  });

  receiveMessage($event: any) {
    if (this.selectedRoomIds.includes($event)) {
      this.selectedRoomIds = this.selectedRoomIds.filter(
        (item) => item != $event
      );

      return;
    }

    this.selectedRoomIds.push($event);
  }

  sendParams() {
    return {
      startDate: this.activatedRoute.snapshot.queryParams['startDate'],
      endDate: this.activatedRoute.snapshot.queryParams['endDate'],
      propertyId: this.activatedRoute.snapshot.parent?.parent?.params['id'],
      selectedRoomIds: this.selectedRoomIds.join(','),
    };
  }
}
