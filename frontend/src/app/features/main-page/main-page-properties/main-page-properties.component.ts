import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { ChildrenOutletContexts, Router, RouterModule } from '@angular/router';
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
import { FILTER_PROPERTY_FORM } from '../filter-property.form';
import { PropertyQueryParams } from '../property-query-params.interface';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { SearchHistoryService } from '$core/search-history.service';
import { slideInAnimation } from '$core/app.animations';
import { LoginService } from '$features/auth/login.service';
import { UserDetails, UserService } from '$backend/services';

@Component({
  selector: 'app-main-page-properties',
  templateUrl: './main-page-properties.component.html',
  styleUrls: ['./main-page-properties.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInAnimation],
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
    MatSlideToggleModule,
    MatDividerModule,
  ],
})
export class MainPagePropertiesComponent implements AfterViewInit {
  readonly router = inject(Router);
  readonly searchPropertyForm = inject(SEARCH_PROPERTY_FORM);
  readonly filterPropertyForm = inject(FILTER_PROPERTY_FORM);
  readonly searchHistoryService = inject(SearchHistoryService);
  readonly loginService = inject(LoginService);
  readonly userService = inject(UserService);

  minDate: Date = new Date();
  maxDate: Date = new Date();

  loggedUserEmail!: string;
  userDetails!: UserDetails;

  constructor(private contexts: ChildrenOutletContexts) {
    this.minDate.setHours(0, 0, 0, 0);
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
    this.maxDate.setHours(0, 0, 0, 0);

    this.loggedUserEmail = this.loginService.getLoggedUserEmail();

    if (this.loggedUserEmail) {
      this.userService
        .usersEmailGet({
          email: this.loggedUserEmail,
        })
        .subscribe((response) => {
          this.userDetails = response;
        });
    }
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.[
      'animation'
    ];
  }

  ngAfterViewInit() {
    this.submitForm();
  }

  submitForm() {
    if (this.searchPropertyForm.get(['location'])!.value != '') {
      this.search(this.searchPropertyForm.value);

      return;
    }

    this.router.navigate(['main/our-recommendations']);
  }

  resetLocationInput() {
    this.searchPropertyForm.patchValue({ location: '' });

    this.router.navigate(['main/our-recommendations']);
  }

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

    startDate.setHours(3, 0, 0, 0);
    endDate.setHours(3, 0, 0, 0);

    const queryParams: PropertyQueryParams = {
      location: location,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numberOfAdults: numberOfAdults,
      numberOfChildren: numberOfChildren,
      numberOfRooms: numberOfRooms,
    };

    const filterValue = this.filterPropertyForm.value;

    if (filterValue.hasFreeWiFi) {
      queryParams['hasFreeWiFi'] = true;
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

    if (filterValue.over1000) {
      queryParams['over1000'] = true;
    }

    if (filterValue.between500and1000) {
      queryParams['between500and1000'] = true;
    }

    if (filterValue.between250and500) {
      queryParams['between250and500'] = true;
    }

    if (filterValue.under250) {
      queryParams['under250'] = true;
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

    if (this.loggedUserEmail && this.userDetails?.retainSearchHistory) {
      this.searchHistoryService.AddSearchToSearchHistory(
        JSON.stringify(this.searchPropertyForm.value)
      );
    }

    this.router.navigate(['main/search-results'], { queryParams: queryParams });
  }
}
