import { Component, inject } from '@angular/core';
import { MultipleImageUploadService } from './multiple-image-uploader.service';
import { ImageFile } from './image-file.model';
import { ImageUploaderModule } from './image-uploader.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multiple-picture-uploader',
  standalone: true,
  imports: [CommonModule, ImageUploaderModule],
  template: `
    <div
      corpImgUpload
      id="drop-box"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
    >
      <span id="message">Drop pictures here</span>
    </div>

    <div id="picture-display">
      <a
        *ngFor="let file of imageFiles$ | async"
        [href]="file.url"
        target="_blank"
      >
        <img [src]="file.url" />
      </a>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        gap: 16px;
      }

      #drop-box {
        width: 500px;
        height: 250px;
        border: solid 5px #75c5e7;
        border-style: dashed;
        display: table;
      }

      #message {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        color: #686868;
      }

      #picture-display {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 8px;
      }

      img {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }
    `,
  ],
})
export class MultipleImageUploadComponent {
  private multipleImageUploadService = inject(MultipleImageUploadService);
  imageFiles$ = this.multipleImageUploadService.imageFiles$;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      const fileList = Array.from(files).map((file) => {
        const url = URL.createObjectURL(file);

        return { file, url } as ImageFile;
      });

      this.multipleImageUploadService.addFiles(fileList);
    }
  }
}
