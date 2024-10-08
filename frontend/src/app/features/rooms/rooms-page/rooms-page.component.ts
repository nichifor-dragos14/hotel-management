import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { RoomService, RoomType } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsPageComponent {
  readonly roomService = inject(RoomService);

  @Input() propertyId!: string;

  roomsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => {
      let propertyId = this.propertyId;

      return this.roomService.roomsGet({ from, to, propertyId });
    },
  });

  roomTypeMapper(value: RoomType): string {
    if (value == RoomType.$0) {
      return 'Single';
    }

    if (value == RoomType.$1) {
      return 'Double';
    }

    if (value == RoomType.$2) {
      return 'Suite';
    }

    if (value == RoomType.$3) {
      return 'Deluxe';
    }

    return '';
  }
}
