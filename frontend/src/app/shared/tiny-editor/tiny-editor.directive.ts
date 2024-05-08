import { environment } from 'frontend/src/environments/environment.development';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  NgZone,
  inject,
} from '@angular/core';
import {
  MAT_FORM_FIELD,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { MatInput, MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { EditorComponent } from '@tinymce/tinymce-angular';

const TINY_CONFIGURATION = {
  skin: false,
  selector: 'textarea',
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
};

@Directive({
  selector: 'editor[appTinyEditor]',
  standalone: true,
  providers: [
    {
      provide: MatFormFieldControl,
      useFactory: () => inject(TinyEditorDirective),
    },
  ],
})
export class TinyEditorDirective extends MatInput {
  @HostBinding('class.editor-placeholder')
  loading: true | undefined = true;

  constructor() {
    const matFormField = inject(MAT_FORM_FIELD);

    const changeDetectorRef = inject(ChangeDetectorRef);
    const tiny = inject(EditorComponent);

    tiny.apiKey = environment.editorApiKey;
    tiny.init = TINY_CONFIGURATION;
    tiny.onInit.pipe(takeUntilDestroyed()).subscribe(() => {
      this.loading = undefined;
      matFormField.floatLabel = 'always';

      changeDetectorRef.markForCheck();
    });

    super(
      inject(ElementRef),
      inject(Platform),
      inject(NgControl, { optional: true, self: true })!,
      inject(NgForm, { optional: true })!,
      inject(FormGroupDirective, { optional: true })!,
      inject(ErrorStateMatcher),
      inject(MAT_INPUT_VALUE_ACCESSOR, { optional: true, self: true }),
      inject(AutofillMonitor),
      inject(NgZone),
      matFormField
    );
  }
}
