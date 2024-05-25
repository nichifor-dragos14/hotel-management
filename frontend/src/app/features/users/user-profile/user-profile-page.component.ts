import { LoginService } from '$features/auth/login.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatListModule, RouterModule],
})
export class UserProfilePageComponent {
  readonly loginService = inject(LoginService)
}
