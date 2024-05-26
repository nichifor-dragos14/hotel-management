import { UpdatePropertyCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { phoneNumberValidator } from './new-property.form';
import { LoginService } from '$features/auth/login.service';

@Injectable({ providedIn: 'root' })
export class EditPropertyFormFactory {
  readonly formBuilder = inject(AppFormBuilder);
  readonly loginService = inject(LoginService);

  build(property: UpdatePropertyCommand): FormGroup {
    return this.formBuilder.group<UpdatePropertyCommand>({
      id: [property.id, { validators: [Validators.required] }],
      name: [
        property.name,
        { validators: [Validators.required, Validators.maxLength(30)] },
      ],
      description: [
        property.description,
        { validators: [Validators.required, Validators.maxLength(1000)] },
      ],
      email: [
        property.email,
        { validators: [Validators.required, Validators.email] },
      ],
      phoneNumber: [
        property.phoneNumber,
        { validators: [Validators.required, phoneNumberValidator()] },
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
      userId: [property.userId, { validators: [Validators.required] }],
    });
  }
}
