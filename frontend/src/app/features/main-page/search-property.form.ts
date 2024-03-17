import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
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
        { validators: [Validators.required] },
      ],
      startDate: [
        queryParams['startDate']
          ? new Date(queryParams['startDate'])
          : new Date(),
        { validators: [Validators.required] },
      ],
      endDate: [
        queryParams['endDate']
          ? new Date(queryParams['endDate'])
          : new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        { validators: [Validators.required] },
      ],
      numberOfAdults: [
        queryParams['numberOfAdults'] || 2,
        { validators: [Validators.required] },
      ],
      numberOfChildren: [
        queryParams['numberOfChildren'] || 0,
        { validators: [Validators.required] },
      ],
      numberOfRooms: [
        queryParams['numberOfRooms'] || 1,
        { validators: [Validators.required] },
      ],
    });
  },
});
