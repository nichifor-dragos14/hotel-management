import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';
import { ActivatedRoute } from '@angular/router';

export const FILTER_PROPERTY_FORM = new InjectionToken('SEARCH_PROPERTY_FORM', {
  providedIn: 'root',
  factory: () => {
    const route = inject(ActivatedRoute);
    const queryParams = route ? route.snapshot.queryParams : {};

    return inject(AppFormBuilder).group({
      hasFreeWiFi: [
        queryParams['hasFreeWiFi'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasParking: [
        queryParams['hasParking'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasRoomService: [
        queryParams['hasRoomService'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasRestaurant: [
        queryParams['hasRestaurant'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasBreakfast: [
        queryParams['hasBreakfast'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasKitchen: [
        queryParams['hasKitchen'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasPool: [
        queryParams['hasPool'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasFitnessCenter: [
        queryParams['hasFitnessCenter'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasPetFriendlyPolicy: [
        queryParams['hasPetFriendlyPolicy'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasFreeCancellation: [
        queryParams['hasFreeCancellation'] ? true : false,
        { validators: [Validators.required] },
      ],

      hasPrivateBathroom: [
        queryParams['hasPrivateBathroom'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasAirConditioning: [
        queryParams['hasAirConditioning'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasTowels: [
        queryParams['hasTowels'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasHairdryer: [
        queryParams['hasHairdryer'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasBalcony: [
        queryParams['hasBalcony'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasSeaView: [
        queryParams['hasSeaView'] ? true : false,
        { validators: [Validators.required] },
      ],
      hasRefrigerator: [
        queryParams['hasRefrigerator'] ? true : false,
        { validators: [Validators.required] },
      ],

      isSuperb: [
        queryParams['isSuperb'] ? true : false,
        { validators: [Validators.required] },
      ],
      isVeryGood: [
        queryParams['isVeryGood'] ? true : false,
        { validators: [Validators.required] },
      ],
      isGood: [
        queryParams['isGood'] ? true : false,
        { validators: [Validators.required] },
      ],
      isPlesant: [
        queryParams['isPlesant'] ? true : false,
        { validators: [Validators.required] },
      ],
      over1000: [
        queryParams['over1000'] ? true : false,
        { validators: [Validators.required] },
      ],
      between500and1000: [
        queryParams['between500and1000'] ? true : false,
        { validators: [Validators.required] },
      ],
      between250and500: [
        queryParams['between250and500'] ? true : false,
        { validators: [Validators.required] },
      ],
      under250: [
        queryParams['under250'] ? true : false,
        { validators: [Validators.required] },
      ],
    });
  },
});
