import { UserDetails } from '$backend/services';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-security-page',
  templateUrl: './user-profile-security-page.component.html',
  styleUrls: ['./user-profile-security-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterModule, MatSlideToggleModule],
})
export class UserProfileSecurityPageComponent {
  @Input() user!: UserDetails;
}
