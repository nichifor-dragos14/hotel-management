import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageFile } from './image-file.model';

@Injectable({
  providedIn: 'root',
})
export class SingleImageUploadService {
  private readonly imageSource = new BehaviorSubject<ImageFile | null>(null);
  imageFile$ = this.imageSource.asObservable();

  setImage(file: ImageFile): void {
    this.imageSource.next(file);
  }

  clearImage(): void {
    this.imageSource.next(null);
  }
}
