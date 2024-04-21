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
import { Subscription } from 'rxjs';

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
    PropertyCardComponent,
    ScrollingModule,
    PropertyCardPlaceholderComponent,
  ],
})
export class MainPageOurRecommendationsComponent {
  propertyService = inject(PropertyService);
  activatedRoute = inject(ActivatedRoute);

  queryParamsSubscription!: Subscription;
}
