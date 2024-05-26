import { CreateRoomCommand, RoomType } from '$backend/services';
import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';
import { LoginService } from '$features/auth/login.service';

export const NEW_ROOM_FORM = new InjectionToken('NEW_ROOM_FORM', {
  providedIn: 'root',
  factory: () => {
    let loginService = inject(LoginService);

    return inject(AppFormBuilder).group<CreateRoomCommand>({
      adultCapacity: [
        1,
        {
          validators: [
            Validators.required,
            Validators.max(8),
            Validators.min(1),
          ],
        },
      ],
      childrenCapacity: [
        0,
        {
          validators: [
            Validators.required,
            Validators.min(0),
            Validators.max(8),
          ],
        },
      ],
      hasAirConditioning: [false, { validators: [Validators.required] }],
      hasBalcony: [false, { validators: [Validators.required] }],
      hasHairdryer: [false, { validators: [Validators.required] }],
      hasPrivateBathroom: [false, { validators: [Validators.required] }],
      hasRefrigerator: [false, { validators: [Validators.required] }],
      hasSeaView: [false, { validators: [Validators.required] }],
      hasTowels: [false, { validators: [Validators.required] }],
      number: [
        0,
        {
          validators: [
            Validators.required,
            Validators.min(1),
            Validators.max(999),
          ],
        },
      ],
      price: [
        0,
        {
          validators: [
            Validators.required,
            Validators.min(1),
            Validators.max(50000),
          ],
        },
      ],
      propertyId: ['', { validators: [Validators.required] }],
      type: [RoomType.$0, { validators: [Validators.required] }],
      userId: [
        loginService.getLoggedUserId(),
        { validators: [Validators.required] },
      ],
    });
  },
});
