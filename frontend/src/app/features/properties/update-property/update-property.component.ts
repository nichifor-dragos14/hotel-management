import { PropertyService, PropertyTypeSummary } from '$backend/services';
import { AppToastService } from '$shared/toast';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  OnChanges,
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
import {
  ImageFile,
  MultipleImageUploadComponent,
  MultipleImageUploadService,
} from '$shared/file-uploader';
import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';
import { LoginService } from '$features/auth/login.service';

@Injectable()
export class CustomConfigService extends StarRatingConfigService {
  constructor() {
    super();
    this.numOfStars = 5;
    this.staticColor = 'ok';
    this.size = 'large';
    this.labelPosition = 'left';
  }
}

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
    MultipleImageUploadComponent,
    StarRatingModule,
  ],
  providers: [
    {
      provide: StarRatingConfigService,
      useClass: CustomConfigService,
    },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePropertyPageComponent implements OnChanges {
  readonly multipleImageUploadService = inject(MultipleImageUploadService);
  readonly propertyService = inject(PropertyService);
  readonly loginService = inject(LoginService);
  readonly toastService = inject(AppToastService);
  readonly router = inject(Router);

  @Input() propertyForm!: FormGroup;
  @Input() propertyTypes: PropertyTypeSummary[] = [];

  files: ImageFile[] = [];

  ngOnChanges() {
    const files = this.propertyForm.get('imageUrls')!.value;
    const arrayFiles = files.split(';');

    this.multipleImageUploadService.preloadFiles(arrayFiles);

    this.multipleImageUploadService.imageFiles$.subscribe((imageFiles) => {
      if (imageFiles) {
        this.files = imageFiles;
      }
    });
  }

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
      return;
    }

    let imageUrls = this.files
      .filter((file) => file.file === null)
      .map((file) => file.url)
      .join(';');

    let uploadFiles = this.files.filter((file) => file.file !== null);

    try {
      try {
        const urls = await Promise.all(
          uploadFiles.map(async (file) => {
            try {
              return await this.propertyService.propertiesUploadPatchAsync({
                body: { File: file.file },
              });
            } catch (err) {
              console.error(err);
              return '';
            }
          })
        );

        if (urls.filter((url) => url !== '').length > 0) {
          imageUrls += ';';
        }

        imageUrls += urls.filter((url) => url !== '').join(';');
      } catch (err) {
        console.error('Error processing files:', err);
      }

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
