import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';

import { TinyEditorDirective } from './tiny-editor.directive';

@NgModule({
  imports: [TinyEditorDirective, EditorModule],
  exports: [TinyEditorDirective, EditorModule],
})
export class TinyEditorModule {}
