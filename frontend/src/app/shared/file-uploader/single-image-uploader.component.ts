import { Component, inject } from '@angular/core';
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
    <p>Insert a cool photo 😎</p>

    <section role="content">
      <section role="upload">
        <div
          corpImgUpload
          id="drop-box"
          (dragover)="onDragOver($event)"
          (drop)="onDrop($event)"
          (mouseenter)="hovering = true"
          (mouseleave)="hovering = false"
        >
          <span class="message" *ngIf="!hovering">Drop your picture here</span>
          <mat-icon class="message" *ngIf="hovering">cloud_upload</mat-icon>
        </div>

        <input
          type="file"
          id="file-input"
          (change)="onFileSelected($event)"
          accept="image/*"
        />
      </section>

      <div id="picture-display" *ngIf="imageFile$ | async as imageFile">
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
        border: solid 5px #75c5e7;
        border-style: dashed;
        display: table;
      }

      .message {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        color: #686868;
      }

      img {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }

      section[role='upload'] {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class SingleImageUploadComponent {
  private singleImageUploadService = inject(SingleImageUploadService);
  imageFile$ = this.singleImageUploadService.imageFile$;

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
