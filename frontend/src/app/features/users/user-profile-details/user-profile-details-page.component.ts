import { Gender, UserService } from '$backend/services';
import { DateConverterModule } from '$shared/date-converter';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { AppToastService } from '$shared/toast';

@Component({
  selector: 'app-user-profile-details-page',
  templateUrl: './user-profile-details-page.component.html',
  styleUrls: ['./user-profile-details-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    RouterModule,
    DateConverterModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
  ],
})
export class UserProfileDetailsPageComponent {
  @Input() userForm!: FormGroup;

  uneditedUserForm = inject(FormBuilder).group({
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    nationality: [''],
    gender: [''],
    address: [''],
    dateOfBirth: [''],
    id: [''],
  });

  userService = inject(UserService);
  toastService = inject(AppToastService);

  editing: boolean = false;

  userGenderMapper(value: Gender): String {
    if (value == Gender.$0) {
      return 'Man';
    }

    if (value == Gender.$1) {
      return 'Woman';
    }

    if (value == Gender.$2) {
      return 'Other';
    }

    return '';
  }

  toggleEditing() {
    this.editing = !this.editing;

    if (!this.editing) {
      this.saveChanges(this.userForm.value);
    } else {
      this.uneditedUserForm.setValue(this.userForm.value);
    }
  }

  cancelEditing() {
    this.userForm.setValue(this.uneditedUserForm.value);
    this.editing = false;
  }

  async saveChanges(newDetails: typeof this.userForm.value) {
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      nationality,
      gender,
      address,
      dateOfBirth,
    } = newDetails;

    if (!this.userForm.valid) {
      return;
    }

    try {
      await this.userService.usersDetailsPatchAsync({
        body: {
          id: id,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          nationality: nationality,
          gender: parseInt(gender),
          address: address,
          dateOfBirth: dateOfBirth,
        },
      });

      this.editing = false;
      this.toastService.open('Successfully updated your profile', 'info');
    } catch (error) {
      this.toastService.open(
        error instanceof Error ? error.message : 'Failed to update profile',
        'error'
      );
      this.cancelEditing();
    }
  }
}
