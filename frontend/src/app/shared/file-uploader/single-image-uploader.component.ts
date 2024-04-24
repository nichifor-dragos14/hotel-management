// single-image-upload.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploaderModule } from './image-uploader.module';
import { ImageFile } from './image-file.model';
import { SingleImageUploadService } from './single-image-uploader.service';

@Component({
  selector: 'app-single-picture-uploader',
  standalone: true,
  imports: [CommonModule, ImageUploaderModule],
  template: `
    <div
      corpImgUpload
      id="drop-box"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
    >
      <span id="message">Drop your picture here</span>
    </div>

    <div id="picture-display" *ngIf="imageFile$ | async as imageFile">
      <a [href]="imageFile.url" target="_blank">
        <img [src]="imageFile.url" />
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
        min-width: 500px;
        min-height: 250px;
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

      img {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }
    `,
  ],
})
export class SingleImageUploadComponent {
  private singleImageUploadService = inject(SingleImageUploadService);
  imageFile$ = this.singleImageUploadService.imageFile$;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0]; // Only take the first file
      const url = URL.createObjectURL(file);

      this.singleImageUploadService.setImage({ file, url } as ImageFile);
    }
  }
}
