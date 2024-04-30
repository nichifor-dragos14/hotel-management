import { UpdateRoomCommand } from '$backend/services';
import { AppFormBuilder } from '$core/forms';
import { Injectable, inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class EditRoomFormFactory {
  readonly formBuilder = inject(AppFormBuilder);

  build(property: UpdateRoomCommand): FormGroup {
    return this.formBuilder.group<UpdateRoomCommand>({
      hasAirConditioning: [
        property.hasAirConditioning,
        { validators: [Validators.required] },
      ],
      hasBalcony: [property.hasBalcony, { validators: [Validators.required] }],
      hasHairdryer: [
        property.hasHairdryer,
        { validators: [Validators.required] },
      ],
      hasPrivateBathroom: [
        property.hasPrivateBathroom,
        { validators: [Validators.required] },
      ],
      hasRefrigerator: [
        property.hasRefrigerator,
        { validators: [Validators.required] },
      ],
      hasSeaView: [property.hasSeaView, { validators: [Validators.required] }],
      hasTowels: [property.hasTowels, { validators: [Validators.required] }],
      id: [property.id, { validators: [Validators.required] }],
      price: [
        property.price,
        {
          validators: [
            Validators.required,
            Validators.min(1),
            Validators.max(50000),
          ],
        },
      ],
    });
  }
}
