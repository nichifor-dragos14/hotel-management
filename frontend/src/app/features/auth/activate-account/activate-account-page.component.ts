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
              this.toastrService.open('Successfully activated account!');
              this.router.navigateByUrl('main/our-recommendations');
            },
            (error) => {
              console.error(error);
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
