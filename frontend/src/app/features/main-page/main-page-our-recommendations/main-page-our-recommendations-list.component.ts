import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  PropertyCardComponent,
  PropertyRecommendationCardComponent,
} from '$shared/cards';
import {
  PropertyService,
  PropertySummaryRecommendation,
} from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  PropertyCardPlaceholderComponent,
  PropertyRecommendationCardPlaceholderComponent,
} from '$shared/placeholders/card-placeholder';
import { SearchHistoryService } from '$core/search-history.service';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatButtonModule } from '@angular/material/button';
import { PropertyQueryParams } from '../property-query-params.interface';

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
export class MainPageOurRecommendationsComponent {
  propertyService = inject(PropertyService);
  searchHistoryService = inject(SearchHistoryService);

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => {
      const searchHistoryFields = this.searchHistoryService.GetSearchHistory();

      return this.propertyService.propertiesRecommendationsGet({
        from: from,
        to: to,
        searchHistoryFields: searchHistoryFields,
      });
    },
  });

  generateDefaultQueryParams(property: PropertySummaryRecommendation) {
    let propertyQueryParams: PropertyQueryParams = {
      startDate: new Date().toISOString(),
      endDate: new Date(
        new Date().getTime() + 24 * 60 * 60 * 1000
      ).toISOString(),
      numberOfChildren: 1,
      numberOfAdults: 2,
      numberOfRooms: 1,
      location: property.location,
    };

    return propertyQueryParams;
  }
}
