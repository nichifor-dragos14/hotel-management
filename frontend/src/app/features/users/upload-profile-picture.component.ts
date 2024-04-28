// upload-profile-picture.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppToastService } from '$shared/toast';
import { AppPageHeaderComponent } from '$shared/page-header';
import { CommonModule } from '@angular/common';
import {
  SingleImageUploadComponent,
  SingleImageUploadService,
} from '$shared/file-uploader';
import { UserDetails, UserService } from '$backend/services';

@Component({
  selector: 'app-upload-profile-picture',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    AppPageHeaderComponent,
    SingleImageUploadComponent,
  ],
  template: `
    <app-page-header title="Update your profile picture 📸">
      <button
        button
        mat-button
        color="primary"
        [disabled]="uploadForm.invalid"
        (click)="uploadImage(uploadForm.value)"
      >
        Update
      </button>
      <button button mat-button color="warn" routerLink="../../">Close</button>
    </app-page-header>

    <form [formGroup]="uploadForm">
      <app-single-picture-uploader
        [title]="
          'Update your profile picture by dropping a photo or clicking on the area below😎'
        "
      >
      </app-single-picture-uploader>
    </form>
  `,
  styles: [
    `
      :host {
        padding: 32px 24px;
        width: 56vw;
        height: 64vh;
        display: flex;
        flex-direction: column;
        gap: 64px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 64px;
        justify-self: center;
      }
    `,
  ],
})
export class UploadProfilePictureComponent implements OnInit {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly userService = inject(UserService);
  readonly toastService = inject(AppToastService);
  readonly singleImageUploadService = inject(SingleImageUploadService);

  uploadForm!: FormGroup;

  @Input() user!: UserDetails;

  ngOnInit(): void {
    this.uploadForm = new FormGroup({
      id: new FormControl(this.user.id, Validators.required),
      picture: new FormControl(null, Validators.required),
    });

    this.singleImageUploadService.imageFile$.subscribe((imageFile) => {
      if (imageFile) {
        this.uploadForm.patchValue({ picture: imageFile.file });
      }
    });
  }

  async uploadImage(newUploadImage: typeof this.uploadForm.value) {
    if (this.uploadForm.invalid) {
      return;
    }

    try {
      await this.userService.usersUploadPatchAsync({
        body: {
          UserId: newUploadImage.id,
          File: newUploadImage.picture,
        },
      });

      this.singleImageUploadService.clearImage();

      this.toastService.open('Successfully updated profile picture', 'info');
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    }
  }
}
