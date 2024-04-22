import { UserDetails, UserService } from '$backend/services';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-upload-profile-picture',
  standalone: true,
  template: `
    <app-page-header title="Update your profile picture 📸">
      <button
        mat-button
        color="primary"
        button
        [disabled]="uploadForm.invalid"
        (click)="uploadImage(uploadForm.value)"
      >
        Update
      </button>
      <button mat-button color="warn" routerLink="../../" button>Close</button>
    </app-page-header>

    <form [formGroup]="uploadForm">
      <div>
        <label for="photo">Photo:</label>
        <input type="file" id="photo" (change)="onFileSelect($event)" />
      </div>
    </form>
  `,
  styles: `
      :host {
        padding: 32px 24px;
        width: 72vw;
        height: 64vh;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
  
      form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 64px;
      }
  `,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    AppPageHeaderComponent,
    ReactiveFormsModule,
    TinyEditorModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProfilePictureComponent implements OnInit {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly userService = inject(UserService);
  readonly toastService = inject(AppToastService);

  @Input() user!: UserDetails;
  uploadForm!: FormGroup;

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      id: new FormControl(this.user.id, Validators.required),
      picture: new FormControl(null, Validators.required),
    });
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];

    if (!file) {
      return;
    }

    if (file) {
      this.uploadForm.patchValue({ picture: file });
    }
  }

  async uploadImage(newUploadImage: typeof this.uploadForm.value) {
    if (this.uploadForm.invalid) {
      return;
    }
    console.log(newUploadImage);
    try {
      await this.userService.usersUploadPatchAsync({
        body: {
          UserId: newUploadImage.id,
          File: newUploadImage.picture,
        },
      });

      this.toastService.open('Succesfully updated profile picture', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    }
  }
}
