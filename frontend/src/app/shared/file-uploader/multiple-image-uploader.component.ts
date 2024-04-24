import { Component, Input, inject } from '@angular/core';
import { MultipleImageUploadService } from './multiple-image-uploader.service';
import { ImageFile } from './image-file.model';
import { ImageUploaderModule } from './image-uploader.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-multiple-picture-uploader',
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
        >
          <span class="message" *ngIf="!hovering">Drop pictures here</span>
          <mat-icon class="message" *ngIf="hovering">cloud_upload</mat-icon>
        </div>

        <input
          type="file"
          id="file-input"
          (change)="onFileSelected($event)"
          accept="image/*"
        />
      </section>

      <div id="picture-display">
        <a
          *ngFor="let file of imageFiles$ | async"
          [href]="file.url"
          target="_blank"
        >
          <img [src]="file.url" />
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
        width: 150px;
        height: 150px;
        object-fit: cover;
      }

      section[role='upload'] {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      h2 {
        font-weight: normal;
      }

      #picture-display {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 8px;
      }
    `,
  ],
})
export class MultipleImageUploadComponent {
  private multipleImageUploadService = inject(MultipleImageUploadService);
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
