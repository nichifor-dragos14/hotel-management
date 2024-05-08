import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderModule } from './image-uploader.module';
import { ImageFile } from './image-file.model';
import { SingleImageUploadService } from './single-image-uploader.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-single-picture-uploader',
  standalone: true,
  imports: [CommonModule, ImageUploaderModule, MatIconModule],
  template: `
    <h2>{{ title }}</h2>

    <section role="content">
      <section role="upload">
        <div
          corpImgUpload
          id="drop-box"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
          (mouseenter)="hovering = true"
          (mouseleave)="hovering = false"
          (click)="onClickFileInput()"
        >
          <span class="message" *ngIf="!hovering">Drop your picture here</span>
          <mat-icon class="message" *ngIf="hovering">cloud_upload</mat-icon>
        </div>

        <input
          type="file"
          id="file-input"
          (change)="onFileSelected($event)"
          accept="image/*"
          style="display: none"
        />
      </section>

      <div class="image-container" *ngIf="imageFile$ | async as imageFile">
        <a [href]="imageFile.url" target="_blank">
          <img [src]="imageFile.url" />
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-items: center;
        align-items: center;
      }

      section[role='content'] {
        display: flex;
        flex-direction: row;
        gap: 16px;
      }

      #drop-box {
        width: 500px;
        height: 250px;
        min-width: 500px;
        min-height: 250px;
        border: solid 3.5px #5e35b1;
        border-style: dashed;
        display: table;
        cursor: pointer;
      }

      .message {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        color: white;
      }

      .image-container {
        position: relative;
        display: inline-block;
        width: 250px;
        height: 250px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      h2 {
        font-weight: normal;
      }
    `,
  ],
})
export class SingleImageUploadComponent {
  private readonly singleImageUploadService = inject(SingleImageUploadService);
  imageFile$ = this.singleImageUploadService.imageFile$;

  @Input() title!: string;

  hovering: boolean = false;

  private resetFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.resetFileInput();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.processFiles(event.dataTransfer!.files);
  }

  onClickFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.processFiles(files);
  }

  private processFiles(files: FileList | null): void {
    if (files && files.length > 0) {
      const file = files[0]; // Only take the first file
      const url = URL.createObjectURL(file);
      this.singleImageUploadService.setImage({ file, url } as ImageFile);
    }
  }
}
