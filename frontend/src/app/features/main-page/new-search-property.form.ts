import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';

export const SEARCH_PROPERTY_FORM = new InjectionToken('SEARCH_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group({
      location: ['', { validators: [Validators.required] }],
      startDate: [new Date(), { validators: [Validators.required] }],
      endDate: [
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        { validators: [Validators.required] },
      ],
      numberOfAdults: [2, { validators: [Validators.required] }],
      numberOfChildren: [0, { validators: [Validators.required] }],
      numberOfRooms: [1, { validators: [Validators.required] }],
    }),
});
