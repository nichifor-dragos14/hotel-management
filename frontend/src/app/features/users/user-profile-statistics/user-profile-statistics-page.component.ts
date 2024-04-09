import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-statistics-page',
  templateUrl: './user-profile-statistics-page.component.html',
  styleUrls: ['./user-profile-statistics-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterModule],
})
export class UserProfileStatisticsPageComponent {}
