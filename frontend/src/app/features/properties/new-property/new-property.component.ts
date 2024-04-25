import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
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
import { GoogleMapsPreviewComponent } from '$shared/google-maps';
import {
  MultipleImageUploadComponent,
  MultipleImageUploadService,
} from '$shared/file-uploader';
import { MatSliderModule } from '@angular/material/slider';

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
    GoogleMapsPreviewComponent,
    MultipleImageUploadComponent,
    MatSliderModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPropertyPageComponent implements OnInit {
  readonly router = inject(Router);
  readonly propertyService = inject(PropertyService);
  readonly toastService = inject(AppToastService);
  readonly propertyForm = inject(NEW_PROPERTY_FORM);
  readonly multipleImageUploadService = inject(MultipleImageUploadService);

  addressOnMap = '';

  files: File[] = [];

  @Input() propertyTypes: PropertyTypeSummary[] = [];

  ngOnInit() {
    this.multipleImageUploadService.clearFiles();

    this.multipleImageUploadService.imageFiles$.subscribe((imageFiles) => {
      if (imageFiles) {
        this.files = imageFiles.map((file) => file.file);
      }
    });
  }

  bindAddressToAddressOnMap() {
    this.addressOnMap = this.propertyForm.value['location']!;
  }

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
      hasKitchen,
      prepaymentNeeded,
      rating,
    } = newProperty;

    if (
      !name ||
      !description ||
      !location ||
      !email ||
      !phoneNumber ||
      type == undefined ||
      rating == undefined ||
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
      prepaymentNeeded == undefined
    ) {
      return;
    }

    let pictureUrls = '';

    try {
      try {
        const urls = await Promise.all(
          this.files.map(async (file) => {
            try {
              return await this.propertyService.propertiesUploadPatchAsync({
                body: { File: file },
              });
            } catch (err) {
              console.error(err);
              return '';
            }
          })
        );

        pictureUrls = urls.filter((url) => url !== '').join(';');
      } catch (err) {
        console.error('Error processing files:', err);
      }

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
          hasKitchen,
          pictureUrls,
          prepaymentNeeded,
          rating,
        },
      });

      this.toastService.open('Successfully added property', 'info');
    } catch (error) {
      if (error instanceof Error) {
        this.toastService.open(error.message, 'error');
      }
    }

    await this.router.navigateByUrl('/properties/reinit');
  }
}
