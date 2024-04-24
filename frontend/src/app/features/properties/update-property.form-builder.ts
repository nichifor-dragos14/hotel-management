/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-prototype-builtins */

import { PropertyDetails, UpdatePropertyCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditPropertyFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(property: UpdatePropertyCommand): FormGroup {
    return this.formBuilder.group<UpdatePropertyCommand>({
      id: [property.id, { validators: [Validators.required] }],
      name: [property.name, { validators: [Validators.required] }],
      description: [
        property.description,
        { validators: [Validators.required] },
      ],
      email: [property.email, { validators: [Validators.required] }],
      phoneNumber: [
        property.phoneNumber,
        { validators: [Validators.required] },
      ],
      hasBreakfast: [
        property.hasBreakfast,
        { validators: [Validators.required] },
      ],
      hasFitnessCenter: [
        property.hasFitnessCenter,
        { validators: [Validators.required] },
      ],
      hasFreeCancellation: [
        property.hasFreeCancellation,
        { validators: [Validators.required] },
      ],
      hasFreeWiFi: [
        property.hasFreeWiFi,
        { validators: [Validators.required] },
      ],
      hasParking: [property.hasParking, { validators: [Validators.required] }],
      hasPetFriendlyPolicy: [
        property.hasPetFriendlyPolicy,
        { validators: [Validators.required] },
      ],
      hasPool: [property.hasPool, { validators: [Validators.required] }],
      hasRestaurant: [
        property.hasRestaurant,
        { validators: [Validators.required] },
      ],
      hasRoomService: [
        property.hasRoomService,
        { validators: [Validators.required] },
      ],
      hasKitchen: [
        property.hasRoomService,
        { validators: [Validators.required] },
      ],
      imageUrls: [
        property.imageUrls ? property.imageUrls : 'test',
        { validators: [Validators.required] },
      ],
      prepaymentNeeded: [
        property.prepaymentNeeded,
        { validators: [Validators.required] },
      ],
      rating: [property.rating, { validators: [Validators.required] }],
    });
  }
}
