import { CreateRoomCommand, RoomType } from '$backend/services';
import { InjectionToken, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppFormBuilder } from '$core/forms';

export const NEW_ROOM_FORM = new InjectionToken('NEW_ROOM_FORM', {
  providedIn: 'root',
  factory: () =>
    inject(AppFormBuilder).group<CreateRoomCommand>({
      adultCapacity: [1, { validators: [Validators.required] }],
      childrenCapacity: [0, { validators: [Validators.required] }],
      hasAirConditioning: [false, { validators: [Validators.required] }],
      hasBalcony: [false, { validators: [Validators.required] }],
      hasHairdryer: [false, { validators: [Validators.required] }],
      hasPrivateBathroom: [false, { validators: [Validators.required] }],
      hasRefrigerator: [false, { validators: [Validators.required] }],
      hasSeaView: [false, { validators: [Validators.required] }],
      hasTowels: [false, { validators: [Validators.required] }],
      number: [0, { validators: [Validators.required] }],
      price: [0, { validators: [Validators.required] }],
      propertyId: ['', { validators: [Validators.required] }],
      type: [RoomType.$0, { validators: [Validators.required] }],
    }),
});
