import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { PropertyRecommendationCardComponent } from '$shared/cards';
import {
  PropertyService,
  PropertySummaryRecommendation,
} from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PropertyRecommendationCardPlaceholderComponent } from '$shared/placeholders/card-placeholder';
import { SearchHistoryService } from '$core/search-history.service';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '$features/auth/login.service';
import { Subscription } from 'rxjs';
import { SEARCH_PROPERTY_FORM } from '../search-property.form';

@Component({
  selector: 'app-main-page-our-recommendations-list',
  templateUrl: './main-page-our-recommendations-list.component.html',
  styleUrls: ['./main-page-our-recommendations-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
  imports: [
    RouterModule,
    MatIconModule,
    CommonModule,
    MatListModule,
    PropertyRecommendationCardComponent,
    ScrollingModule,
    PropertyRecommendationCardPlaceholderComponent,
    AppPageHeaderComponent,
    MatButtonModule,
  ],
})
export class MainPageOurRecommendationsComponent implements OnInit {
  readonly cdr = inject(ChangeDetectorRef);
  readonly propertyService = inject(PropertyService);
  readonly loginService = inject(LoginService);
  readonly searchHistoryService = inject(SearchHistoryService);
  readonly searchForm = inject(SEARCH_PROPERTY_FORM);

  private subscription: Subscription = new Subscription();
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.subscribeToLoginStatus();
  }

  private subscribeToLoginStatus(): void {
    this.subscription.add(
      this.loginService.isLoggedIn$.subscribe((status) => {
        this.isLoggedIn = status;
        this.cdr.detectChanges();
      })
    );
  }

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => {
      const searchHistoryFields = this.searchHistoryService.GetSearchHistory();

      return this.propertyService.propertiesRecommendationsGet({
        logggedUsedId: this.loginService.getLoggedUserId(),
        from: from,
        to: to,
        searchHistoryFields: searchHistoryFields,
      });
    },
  });

  setValueOfSearchForm(location: string) {
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    startDate.setHours(3, 0, 0, 0);
    endDate.setHours(3, 0, 0, 0);

    this.searchForm.setValue({
      location: location,
      startDate: startDate,
      endDate: endDate,
      numberOfAdults: 2,
      numberOfChildren: 0,
      numberOfRooms: 1,
    });
  }

  generateDefaultQueryParams(property: PropertySummaryRecommendation) {
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    startDate.setHours(3, 0, 0, 0);
    endDate.setHours(3, 0, 0, 0);

    let propertyQueryParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numberOfChildren: 0,
      numberOfAdults: 2,
      numberOfRooms: 1,
      location: property.location,
    };

    return propertyQueryParams;
  }
}
