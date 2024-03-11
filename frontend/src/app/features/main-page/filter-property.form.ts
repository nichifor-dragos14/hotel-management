import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';

export const FILTER_PROPERTY_FORM = new InjectionToken('SEARCH_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group({
      hasWiFi: [false, { validators: [Validators.required] }],
      hasParking: [false, { validators: [Validators.required] }],
      hasRoomService: [false, { validators: [Validators.required] }],
      hasRestaurant: [false, { validators: [Validators.required] }],
      hasBreakfast: [false, { validators: [Validators.required] }],
      hasKitchen: [false, { validators: [Validators.required] }],
      hasPool: [false, { validators: [Validators.required] }],
      hasFitnessCenter: [false, { validators: [Validators.required] }],
      hasPetFriendlyPolicy: [false, { validators: [Validators.required] }],
      hasFreeCancellation: [false, { validators: [Validators.required] }],

      hasPrivateBathroom: [false, { validators: [Validators.required] }],
      hasAirConditioning: [false, { validators: [Validators.required] }],
      hasTowels: [false, { validators: [Validators.required] }],
      hasHairdryer: [false, { validators: [Validators.required] }],
      hasBalcony: [false, { validators: [Validators.required] }],
      hasSeaView: [false, { validators: [Validators.required] }],
      hasRefrigerator: [false, { validators: [Validators.required] }],

      isSuperb: [false, { validators: [Validators.required] }],
      isVeryGood: [false, { validators: [Validators.required] }],
      isGood: [false, { validators: [Validators.required] }],
      isPlesant: [false, { validators: [Validators.required] }],
    }),
});
