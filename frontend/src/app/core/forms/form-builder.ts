import { Injectable, inject } from '@angular/core';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  NonNullableFormBuilder,
  ValidatorFn,
} from '@angular/forms';

type AppFormControlConfiguration<TValue extends NonNullable<object>> = {
  [K in keyof TValue]: [
    initialValue: TValue[K],
    options?: {
      validators?: Array<ValidatorFn>;
      asyncValidators?: Array<AsyncValidatorFn>;
    },
  ];
};

@Injectable({ providedIn: 'root' })
export class AppFormBuilder {
  readonly #formBuilder = inject(NonNullableFormBuilder);

  group<TValue extends NonNullable<object>>(
    definition: AppFormControlConfiguration<TValue>,
    options?: AbstractControlOptions
  ) {
    return this.#formBuilder.group(definition, options);
  }
}
