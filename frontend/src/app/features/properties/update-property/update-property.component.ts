import { PropertyService, PropertyTypeSummary } from '$backend/services';
import { AppToastService } from '$shared/toast';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-update-property-page',
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    TinyEditorModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePropertyPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);
  readonly router = inject(Router);
  @Input() propertyForm!: FormGroup;

  @Input() propertyTypes: PropertyTypeSummary[] = [];

  async updateProperty(newProperty: typeof this.propertyForm.value) {
    const {
      id,
      name,
      description,
      email,
      phoneNumber,
      hasBreakfast,
      hasFitnessCenter,
      hasFreeCancellation,
      hasFreeWiFi,
      hasParking,
      hasPetFriendlyPolicy,
      hasPool,
      hasRestaurant,
      hasRoomService,
      hasKitchen,
      prepaymentNeeded,
      rating,
      imageUrls,
    } = newProperty;

    if (
      !id ||
      !name ||
      !description ||
      !email ||
      !phoneNumber ||
      hasBreakfast == undefined ||
      hasFitnessCenter == undefined ||
      hasFreeCancellation == undefined ||
      hasFreeWiFi == undefined ||
      hasParking == undefined ||
      hasPetFriendlyPolicy == undefined ||
      hasPool == undefined ||
      hasRestaurant == undefined ||
      hasRoomService == undefined ||
      hasKitchen == undefined ||
      prepaymentNeeded == undefined ||
      rating == undefined
    ) {
      console.log(newProperty);
      return;
    }

    try {
      await this.propertyService.propertiesPatchAsync({
        body: {
          id,
          name,
          description,
          email,
          phoneNumber,
          hasBreakfast,
          hasFitnessCenter,
          hasFreeCancellation,
          hasFreeWiFi,
          hasParking,
          hasPetFriendlyPolicy,
          hasPool,
          hasRestaurant,
          hasRoomService,
          hasKitchen,
          prepaymentNeeded,
          rating,
          imageUrls,
        },
      });

      this.toastService.open('Successfully updated property', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    } finally {
      await this.router.navigateByUrl('/properties/reinit');
    }
  }
}
