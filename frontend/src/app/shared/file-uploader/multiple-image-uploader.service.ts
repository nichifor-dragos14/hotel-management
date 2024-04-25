import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageFile } from './image-file.model';
import { AppToastService } from '$shared/toast';

@Injectable({
  providedIn: 'root',
})
export class MultipleImageUploadService {
  toastrService = inject(AppToastService);

  private filesSource = new BehaviorSubject<ImageFile[]>([]);
  imageFiles$ = this.filesSource.asObservable();
  maxFilesCount = 7;

  preloadFiles(urls: string[]): void {
    const preloadedFiles = urls.map((url) => ({
      url: url,
      file: null,
    })) as unknown as ImageFile[];
    this.filesSource.next(preloadedFiles);
  }

  addFiles(files: ImageFile[]): void {
    const currentFiles = this.filesSource.value;
    const availableSlots = this.maxFilesCount - currentFiles.length;

    if (availableSlots > 0) {
      const filesToAdd = files.slice(0, availableSlots);
      this.filesSource.next([...currentFiles, ...filesToAdd]);
    } else {
      this.toastrService.open('You cat upload at most 7 pictures', 'warning');
    }
  }

  removeFile(index: number): void {
    const currentFiles = this.filesSource.value;
    currentFiles.splice(index, 1);

    this.filesSource.next(currentFiles);
  }

  clearFiles(): void {
    this.filesSource.next([]);
  }
}
