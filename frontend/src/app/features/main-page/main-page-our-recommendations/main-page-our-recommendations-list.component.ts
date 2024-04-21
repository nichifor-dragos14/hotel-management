import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import {
  PropertyCardComponent,
  PropertyRecommendationCardComponent,
} from '$shared/cards';
import { PropertyService } from '$backend/services';
import { PaginatedDataSource } from '$core/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  PropertyCardPlaceholderComponent,
  PropertyRecommendationCardPlaceholderComponent,
} from '$shared/placeholders/card-placeholder';
import { SearchHistoryService } from '$core/search-history.service';
import { AppPageHeaderComponent } from '$shared/page-header';
import { MatButtonModule } from '@angular/material/button';

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
  activatedRoute = inject(ActivatedRoute);
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
}
