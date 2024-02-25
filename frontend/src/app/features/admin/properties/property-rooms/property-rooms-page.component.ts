import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PropertyRooms } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-page',
  templateUrl: './property-rooms-page.component.html',
  styleUrls: ['./property-rooms-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule, MatButtonModule, CommonModule],
})
export class PropertyRoomsPageComponent {
  @Input() rooms!: PropertyRooms[];
}
