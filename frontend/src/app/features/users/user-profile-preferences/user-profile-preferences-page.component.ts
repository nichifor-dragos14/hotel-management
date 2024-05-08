import { UserService } from '$backend/services';
import { AppToastService } from '$shared/toast';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile-preferences-page',
  templateUrl: './user-profile-preferences-page.component.html',
  styleUrls: ['./user-profile-preferences-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
})
export class UserProfilePreferencesPageComponent implements AfterViewInit {
  readonly userService = inject(UserService);
  readonly toastService = inject(AppToastService);

  @Input() userForm!: FormGroup;

  uneditedUserForm = inject(FormBuilder).group({
    id: [''],
    sendOffersOnEmail: [false],
    retainSearchHistory: [false],
  });

  ngAfterViewInit() {
    this.uneditedUserForm.setValue(this.userForm.value);
  }

  cancelEditing() {
    this.userForm.setValue(this.uneditedUserForm.value);
  }

  async saveChanges(newDetails: typeof this.userForm.value) {
    const { id, sendOffersOnEmail, retainSearchHistory } = newDetails;

    if (!this.userForm.valid) {
      return;
    }

    try {
      await this.userService.usersPreferencesPatchAsync({
        body: {
          id: id,
          sendOffersOnEmail: sendOffersOnEmail,
          retainSearchHistory: retainSearchHistory,
        },
      });

      this.toastService.open('Successfully updated your preferences', 'info');
    } catch (error) {
      this.toastService.open(
        error instanceof Error ? error.message : 'Failed to update profile',
        'error'
      );
      this.cancelEditing();
    }
  }
}
