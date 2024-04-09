import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-bookings-page',
  templateUrl: './user-profile-bookings-page.component.html',
  styleUrls: ['./user-profile-bookings-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterModule],
})
export class UserProfileBookingsPageComponent {}
