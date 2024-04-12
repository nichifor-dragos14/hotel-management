import { UpdateUserPreferencesCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditUserPreferencesFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(user: UpdateUserPreferencesCommand): FormGroup {
    return this.formBuilder.group<UpdateUserPreferencesCommand>({
      id: [user.id, { validators: [Validators.required] }],
      retainSearchHistory: [
        user.retainSearchHistory,
        { validators: [Validators.required] },
      ],
      sendOffersOnEmail: [
        user.sendOffersOnEmail,
        { validators: [Validators.required] },
      ],
    });
  }
}
