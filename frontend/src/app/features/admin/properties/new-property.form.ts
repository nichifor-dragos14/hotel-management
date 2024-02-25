import { CreatePropertyCommand, PropertyType } from '$backend/services';
import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';

export const NEW_PROPERTY_FORM = new InjectionToken('NEW_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group<CreatePropertyCommand>({
      name: ['', { validators: [Validators.required] }],
      description: ['', { validators: [Validators.required] }],
      location: ['', { validators: [Validators.required] }],
      email: ['', { validators: [Validators.required] }],
      phoneNumber: ['', { validators: [Validators.required] }],
      type: [PropertyType.$0, { validators: [Validators.required] }],
      hasBreakfast: [false, { validators: [Validators.required] }],
      hasFitnessCentre: [false, { validators: [Validators.required] }],
      hasFreeCancellation: [false, { validators: [Validators.required] }],
      hasFreeWiFi: [false, { validators: [Validators.required] }],
      hasParking: [false, { validators: [Validators.required] }],
      hasPetFriendlyPolicy: [false, { validators: [Validators.required] }],
      hasPool: [false, { validators: [Validators.required] }],
      hasRestaurant: [false, { validators: [Validators.required] }],
      hasRoomService: [false, { validators: [Validators.required] }],
    }),
});
