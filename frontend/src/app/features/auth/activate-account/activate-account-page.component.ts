import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '$backend/services';
import { AppToastService } from '$shared/toast';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-activate-account-page',
  templateUrl: './activate-account-page.component.html',
  styleUrls: ['./activate-account-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatProgressSpinnerModule],
})
export class ActivateAccountPageComponent implements OnInit {
  readonly activatedRoute = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly toastrService = inject(AppToastService);

  ngOnInit() {
    this.authService
      .authGetActivationGet({
        email: this.activatedRoute.snapshot.queryParams['email'],
        token: this.activatedRoute.snapshot.queryParams['token'],
      })
      .subscribe(
        (result) => {
          this.authService.authActivatePost({ body: { id: result } }).subscribe(
            (result) => {
              this.toastrService.open(
                'Successfully activated account!',
                'info'
              );
              this.router.navigateByUrl('main/our-recommendations');
            },
            (error) => {
              this.toastrService.open('Can not activate account', 'error');
              this.router.navigateByUrl('main/our-recommendations');
            }
          );
        },
        (error) => {
          this.toastrService.open('Invalid token or email', 'error');
          this.router.navigateByUrl('main/our-recommendations');
        }
      );
  }
}
