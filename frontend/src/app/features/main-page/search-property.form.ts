import { InjectionToken, inject } from '@angular/core';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';
import { ActivatedRoute } from '@angular/router';

export const SEARCH_PROPERTY_FORM = new InjectionToken('SEARCH_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () => {
    const route = inject(ActivatedRoute);
    const queryParams = route ? route.snapshot.queryParams : {};

    return inject(AppFormBuilder).group({
      location: [
        queryParams['location'] || '',
        { validators: [Validators.maxLength(100)] },
      ],
      startDate: [
        queryParams['startDate']
          ? new Date(queryParams['startDate'])
          : new Date(),
        { validators: [Validators.required, afterToday()] },
      ],
      endDate: [
        queryParams['endDate']
          ? new Date(queryParams['endDate'])
          : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        { validators: [Validators.required, afterTomorrow()] },
      ],
      numberOfAdults: [
        queryParams['numberOfAdults'] || 2,
        {
          validators: [
            Validators.required,
            Validators.max(8),
            Validators.min(1),
          ],
        },
      ],
      numberOfChildren: [
        queryParams['numberOfChildren'] || 0,
        {
          validators: [
            Validators.required,
            Validators.max(8),
            Validators.min(0),
          ],
        },
      ],
      numberOfRooms: [
        queryParams['numberOfRooms'] || 1,
        {
          validators: [
            Validators.required,
            Validators.max(4),
            Validators.min(1),
          ],
        },
      ],
    });
  },
});

export function afterToday(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date().setHours(0, 0, 0, 0);

    const inputDate = new Date(control.value);

    if (inputDate.setHours(0, 0, 0, 0) >= today) {
      return null;
    }

    return { afterToday: { value: control.value } };
  };
}

export function afterTomorrow(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const inputDate = new Date(control.value).setHours(0, 0, 0, 0);

    if (inputDate >= tomorrow.setHours(0, 0, 0, 0)) {
      return null;
    }

    return { afterTomorrow: { value: control.value } };
  };
}
