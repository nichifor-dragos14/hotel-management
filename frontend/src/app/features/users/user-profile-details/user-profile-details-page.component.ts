import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-details-page',
  templateUrl: './user-profile-details-page.component.html',
  styleUrls: ['./user-profile-details-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterModule],
})
export class UserProfileDetailsPageComponent {}
