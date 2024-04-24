import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageFile } from './image-file.model';

@Injectable({
  providedIn: 'root',
})
export class MultipleImageUploadService {
  private filesSource = new BehaviorSubject<ImageFile[]>([]);
  imageFiles$ = this.filesSource.asObservable();

  addFiles(files: ImageFile[]): void {
    this.filesSource.next([...this.filesSource.value, ...files]);
  }

  clearFiles(): void {
    this.filesSource.next([]);
  }
}
