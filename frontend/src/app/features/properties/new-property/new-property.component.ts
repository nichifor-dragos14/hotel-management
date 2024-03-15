import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { NEW_PROPERTY_FORM } from '../new-property.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { TinyEditorModule } from '$shared/tiny-editor';
import { MatIconModule } from '@angular/material/icon';
import { PropertyService, PropertyTypeSummary } from '$backend/services';
import { AppToastService } from '$shared/toast';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-new-property-page',
  templateUrl: './new-property.component.html',
  styleUrls: ['./new-property.component.scss'],
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
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPropertyPageComponent {
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);
  readonly propertyForm = inject(NEW_PROPERTY_FORM);
  readonly router = inject(Router);

  @Input() propertyTypes: PropertyTypeSummary[] = [];

  async createProperty(newProperty: typeof this.propertyForm.value) {
    const {
      name,
      description,
      location,
      email,
      phoneNumber,
      type,
      hasBreakfast,
      hasFitnessCenter,
      hasFreeCancellation,
      hasFreeWiFi,
      hasParking,
      hasPetFriendlyPolicy,
      hasPool,
      hasRestaurant,
      hasRoomService,
    } = newProperty;

    if (
      !name ||
      !description ||
      !location ||
      !email ||
      !phoneNumber ||
      type == undefined ||
      hasBreakfast == undefined ||
      hasFitnessCenter == undefined ||
      hasFreeCancellation == undefined ||
      hasFreeWiFi == undefined ||
      hasParking == undefined ||
      hasPetFriendlyPolicy == undefined ||
      hasPool == undefined ||
      hasRestaurant == undefined ||
      hasRoomService == undefined
    ) {
      return;
    }

    try {
      await this.propertyService.propertiesPostAsync({
        body: {
          name,
          description,
          location,
          email,
          phoneNumber,
          type,
          hasBreakfast,
          hasFitnessCenter,
          hasFreeCancellation,
          hasFreeWiFi,
          hasParking,
          hasPetFriendlyPolicy,
          hasPool,
          hasRestaurant,
          hasRoomService,
        },
      });

      this.toastService.open('Successfully added property', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    }

    await this.router.navigateByUrl('properties/admin');
  }
}
