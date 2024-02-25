/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-prototype-builtins */

import { PropertyDetails } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditPropertyFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(property: PropertyDetails): FormGroup {
    return this.formBuilder.group<PropertyDetails>({
      id: [property.id, { validators: [Validators.required] }],
      name: [property.name, { validators: [Validators.required] }],
      description: [
        property.description,
        { validators: [Validators.required] },
      ],
      location: [property.location, { validators: [Validators.required] }],
      type: [property.type, { validators: [Validators.required] }],
      email: [property.email, { validators: [Validators.required] }],
      phoneNumber: [
        property.phoneNumber,
        { validators: [Validators.required] },
      ],
      createdOn: [property.createdOn, { validators: [Validators.required] }],
      updatedOn: [property.updatedOn, { validators: [Validators.required] }],
      hasBreakfast: [
        property.hasBreakfast,
        { validators: [Validators.required] },
      ],
      hasFitnessCentre: [
        property.hasFitnessCentre,
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
    });
  }
}
