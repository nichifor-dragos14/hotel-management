import { NgModule } from '@angular/core';
import { ImageUploaderDirective } from './image-uploader.directive';

@NgModule({
  imports: [ImageUploaderDirective],
  exports: [ImageUploaderDirective],
})
export class ImageUploaderModule {}
