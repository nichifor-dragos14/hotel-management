import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SEARCH_PROPERTY_FORM } from '../search-property.form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateConverterModule } from '$shared/date-converter';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FILTER_PROPERTY_FORM } from '../filter-property.form';
import { PropertyQueryParams } from '../property-query-params.interface';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
    ScrollingModule,
    MatSlideToggleModule,
  ],
})
export class MainPagePropertiesComponent {
  readonly searchPropertyForm = inject(SEARCH_PROPERTY_FORM);
  readonly filterPropertyForm = inject(FILTER_PROPERTY_FORM);
  readonly router = inject(Router);

  search(newSearch: typeof this.searchPropertyForm.value) {
    const {
      location,
      startDate,
      endDate,
      numberOfAdults,
      numberOfChildren,
      numberOfRooms,
    } = newSearch;

    if (
      !location ||
      !startDate ||
      !endDate ||
      numberOfAdults === undefined ||
      numberOfChildren === undefined ||
      numberOfRooms === undefined
    ) {
      return;
    }

    const queryParams: PropertyQueryParams = {
      location: location,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numberOfAdults: numberOfAdults,
      numberOfChildren: numberOfChildren,
      numberOfRooms: numberOfRooms,
    };

    const filterValue = this.filterPropertyForm.value;

    if (filterValue.hasWiFi) {
      queryParams['hasWiFi'] = true;
    }

    if (filterValue.hasParking) {
      queryParams['hasParking'] = true;
    }

    if (filterValue.hasRoomService) {
      queryParams['hasRoomService'] = true;
    }

    if (filterValue.hasRestaurant) {
      queryParams['hasRestaurant'] = true;
    }

    if (filterValue.hasBreakfast) {
      queryParams['hasBreakfast'] = true;
    }

    if (filterValue.hasKitchen) {
      queryParams['hasKitchen'] = true;
    }

    if (filterValue.hasPool) {
      queryParams['hasPool'] = true;
    }

    if (filterValue.hasFitnessCenter) {
      queryParams['hasFitnessCenter'] = true;
    }

    if (filterValue.hasPetFriendlyPolicy) {
      queryParams['hasPetFriendlyPolicy'] = true;
    }

    if (filterValue.hasFreeCancellation) {
      queryParams['hasFreeCancellation'] = true;
    }

    if (filterValue.hasPrivateBathroom) {
      queryParams['hasPrivateBathroom'] = true;
    }

    if (filterValue.hasAirConditioning) {
      queryParams['hasAirConditioning'] = true;
    }

    if (filterValue.hasTowels) {
      queryParams['hasTowels'] = true;
    }

    if (filterValue.hasHairdryer) {
      queryParams['hasHairdryer'] = true;
    }

    if (filterValue.hasBalcony) {
      queryParams['hasBalcony'] = true;
    }

    if (filterValue.hasSeaView) {
      queryParams['hasSeaView'] = true;
    }

    if (filterValue.hasRefrigerator) {
      queryParams['hasRefrigerator'] = true;
    }

    if (filterValue.isPlesant) {
      queryParams['isPlesant'] = true;
    } else if (filterValue.isGood) {
      queryParams['isGood'] = true;
    } else if (filterValue.isVeryGood) {
      queryParams['isVeryGood'] = true;
    } else if (filterValue.isSuperb) {
      queryParams['isSuperb'] = true;
    }

    this.router.navigate(['main/search-results'], { queryParams: queryParams });
  }
}
