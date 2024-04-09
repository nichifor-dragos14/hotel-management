import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-preferences-page',
  templateUrl: './user-profile-preferences-page.component.html',
  styleUrls: ['./user-profile-preferences-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterModule],
})
export class UserProfilePreferencesPageComponent {}
