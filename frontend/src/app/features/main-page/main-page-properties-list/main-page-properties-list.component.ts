import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { PropertyCardComponent } from '$shared/cards';
import { PropertyService } from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PropertyCardPlaceholderComponent } from '$shared/placeholders/card-placeholder';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '$features/auth/login.service';

@Component({
  selector: 'app-main-page-properties-list',
  templateUrl: './main-page-properties-list.component.html',
  styleUrls: ['./main-page-properties-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    RouterModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    PropertyCardComponent,
    ScrollingModule,
    PropertyCardPlaceholderComponent,
    AppPageHeaderComponent,
    MatButtonModule,
  ],
})
export class MainPagePropertiesListComponent {
  readonly propertyService = inject(PropertyService);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly loginService = inject(LoginService);

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => {
      return this.propertyService.propertiesFilterLocationStartDateEndDateNumberOfAdultsNumberOfChildrenNumberOfRoomsGet(
        {
          LoggedUserId: this.loginService.getLoggedUserId(),
          from,
          to,
          location: this.activatedRoute.snapshot.queryParams['location'],
          startDate: this.activatedRoute.snapshot.queryParams['startDate'],
          endDate: this.activatedRoute.snapshot.queryParams['endDate'],
          numberOfAdults:
            this.activatedRoute.snapshot.queryParams['numberOfAdults'],
          numberOfChildren:
            this.activatedRoute.snapshot.queryParams['numberOfChildren'],
          numberOfRooms:
            this.activatedRoute.snapshot.queryParams['numberOfRooms'],
          HasFreeWiFi: this.activatedRoute.snapshot.queryParams['hasFreeWiFi'],
          HasParking: this.activatedRoute.snapshot.queryParams['hasParking'],
          HasRoomService:
            this.activatedRoute.snapshot.queryParams['hasRoomService'],
          HasRestaurant:
            this.activatedRoute.snapshot.queryParams['hasRestaurant'],
          HasBreakfast:
            this.activatedRoute.snapshot.queryParams['hasBreakfast'],
          HasKitchen: this.activatedRoute.snapshot.queryParams['hasKitchen'],
          HasPool: this.activatedRoute.snapshot.queryParams['hasPool'],
          HasFitnessCenter:
            this.activatedRoute.snapshot.queryParams['hasFitnessCenter'],
          HasPetFriendlyPolicy:
            this.activatedRoute.snapshot.queryParams['hasPetFriendlyPolicy'],
          HasFreeCancellation:
            this.activatedRoute.snapshot.queryParams['hasFreeCancellation'],

          HasPrivateBathroom:
            this.activatedRoute.snapshot.queryParams['hasPrivateBathroom'],
          HasAirConditioning:
            this.activatedRoute.snapshot.queryParams['hasAirConditioning'],
          HasTowels: this.activatedRoute.snapshot.queryParams['hasTowels'],
          HasHairdryer:
            this.activatedRoute.snapshot.queryParams['hasHairdryer'],
          HasBalcony: this.activatedRoute.snapshot.queryParams['hasBalcony'],
          HasSeaView: this.activatedRoute.snapshot.queryParams['hasSeaView'],
          HasRefrigerator:
            this.activatedRoute.snapshot.queryParams['hasRefrigerator'],

          RatingOver9: this.activatedRoute.snapshot.queryParams['isSuperb'],
          RatingOver8: this.activatedRoute.snapshot.queryParams['isVeryGood'],
          RatingOver7: this.activatedRoute.snapshot.queryParams['isGood'],
          RatingOver6: this.activatedRoute.snapshot.queryParams['isPlesant'],
          Over1000: this.activatedRoute.snapshot.queryParams['over1000'],
          Between500and1000:
            this.activatedRoute.snapshot.queryParams['between500and1000'],
          Between250and500:
            this.activatedRoute.snapshot.queryParams['between250and500'],
          Under250: this.activatedRoute.snapshot.queryParams['under250'],
        }
      );
    },
  });
}
