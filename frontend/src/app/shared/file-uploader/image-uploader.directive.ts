import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageFile } from './image-file.model';

enum DropColor {
  Default = 'rgba(94, 53, 177, 0.7)',
  Over = '#ACADAD',
}

@Directive({
  selector: '[corpImgUpload]',
  standalone: true,
})
export class ImageUploaderDirective {
  @Output() dropFiles: EventEmitter<ImageFile[]> = new EventEmitter();
  @HostBinding('style.background') backgroundColor = DropColor.Default;

  readonly sanitizer = inject(DomSanitizer);

  @HostListener('dragover', ['$event']) public dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Over;
  }

  @HostListener('dragleave', ['$event']) public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;
  }

  @HostListener('drop', ['$event']) public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.backgroundColor = DropColor.Default;

    let fileList = event.dataTransfer!.files;
    let files: ImageFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(file)
      );
      files.push({ file, url });
    }
    if (files.length > 0) {
      this.dropFiles.emit(files);
    }
  }
}
