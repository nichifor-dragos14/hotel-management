import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AppPageHeaderComponent } from '$shared/page-header';
import { ReportService } from '$backend/services';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { PaginatedDataSource } from '$core/pagination';
import { AppLinePlaceholderComponent } from '$shared/placeholders/line-placeholder';
import { AppCirclePlaceholderComponent } from '$shared/placeholders/circle-placeholder';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  imports: [
    RouterModule,
    MatButtonModule,
    AppPageHeaderComponent,
    ScrollingModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    AppLinePlaceholderComponent,
    AppCirclePlaceholderComponent,
    CommonModule,
    MatTabsModule,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPageComponent {
  readonly reportService = inject(ReportService);

  openReportsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => this.reportService.reportsOpenGet({ from, to }),
  });

  closedReportsDataSource = new PaginatedDataSource({
    fetch: ({ from, to }) => this.reportService.reportsClosedGet({ from, to }),
  });
}
