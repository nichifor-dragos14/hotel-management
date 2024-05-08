import { Component, Input, inject } from '@angular/core';
import { MultipleImageUploadService } from './multiple-image-uploader.service';
import { ImageFile } from './image-file.model';
import { ImageUploaderModule } from './image-uploader.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-multiple-picture-uploader',
  standalone: true,
  imports: [CommonModule, ImageUploaderModule, MatIconModule, MatButtonModule],
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
          <span class="message" *ngIf="!hovering">Drop pictures here</span>
          <mat-icon class="message" *ngIf="hovering">cloud_upload</mat-icon>
        </div>

        <input
          type="file"
          id="file-input"
          (change)="onFileSelected($event)"
          accept="image/*"
          style="display: none;"
        />
      </section>

      <div id="picture-display">
        <div
          *ngFor="let file of imageFiles$ | async; let i = index"
          class="image-container"
        >
          <a [href]="file.url" target="_blank">
            <img [src]="file.url" />
          </a>
          <button
            mat-icon-button
            (click)="deleteImage(i)"
            class="delete-btn"
            color="warn"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
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

      #picture-display {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }

      .image-container {
        position: relative;
        display: inline-block;
        width: 120px;
        height: 120px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .delete-btn {
        z-index: 10;
        position: absolute;
        top: 0;
        right: 0;
      }

      h2 {
        font-weight: normal;
      }
    `,
  ],
})
export class MultipleImageUploadComponent {
  private readonly multipleImageUploadService = inject(
    MultipleImageUploadService
  );
  imageFiles$ = this.multipleImageUploadService.imageFiles$;

  @Input() title!: string;

  hovering: boolean = false;

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.processFiles(event.dataTransfer!.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onClickFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.processFiles(files);
  }

  deleteImage(index: number): void {
    this.multipleImageUploadService.removeFile(index);
  }

  private processFiles(files: FileList | null): void {
    if (files) {
      const fileList = Array.from(files).map((file) => {
        const url = URL.createObjectURL(file);

        return { file, url } as ImageFile;
      });

      this.multipleImageUploadService.addFiles(fileList);
    }
  }
}
