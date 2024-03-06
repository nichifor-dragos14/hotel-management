import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { PropertyService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';

@Component({
  selector: 'app-properties-page',
  templateUrl: './properties-page.component.html',
  styleUrls: ['./properties-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPageComponent {
  propertyService = inject(PropertyService);

  propertiesDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => this.propertyService.propertiesGet({ from, to }),
  });
}
