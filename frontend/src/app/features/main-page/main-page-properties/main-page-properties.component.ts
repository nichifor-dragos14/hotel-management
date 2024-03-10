import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SEARCH_PROPERTY_FORM } from '../new-search-property.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateConverterModule } from '$shared/date-converter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { AppPageHeaderComponent } from '$shared/page-header';
import { PropertyCardComponent } from '$shared/cards';
import { PropertyDetails } from '$backend/services';

@Component({
  selector: 'app-main-page-properties',
  templateUrl: './main-page-properties.component.html',
  styleUrls: ['./main-page-properties.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DateConverterModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    AppPageHeaderComponent,
    PropertyCardComponent,
  ],
})
export class MainPagePropertiesComponent {
  readonly searchPropertyForm = inject(SEARCH_PROPERTY_FORM);

  search(newSearch: typeof this.searchPropertyForm.value) {
    console.log(newSearch);
  }

  arrayLength = Array(1).fill(0); // Create an array with 10 elements

  generateProperty(index: number): PropertyDetails {
    return {
      createdOn: new Date().toISOString(),
      description: `Property ${index + 1} description`,
      email: `property${index + 1}@example.com`,
      hasBreakfast: index % 2 === 0,
      hasFitnessCenter: index % 3 === 0,
      hasFreeCancellation: index % 4 === 0,
      hasFreeWiFi: index % 5 === 0,
      hasParking: index % 6 === 0,
      hasPetFriendlyPolicy: index % 7 === 0,
      hasPool: index % 8 === 0,
      hasRestaurant: index % 9 === 0,
      hasRoomService: index % 10 === 0,
      id: `property-${index + 1}`,
      location: `Location ${index + 1}`,
      name: `Property ${index + 1}`,
      phoneNumber: `123-456-${index.toString().padStart(2, '0')}`,
      type: 0, // Assuming 'Apartment' as default type
      updatedOn: new Date().toISOString(),
    };
  }
}
