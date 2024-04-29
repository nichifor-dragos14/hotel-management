import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ReportDetails, ReportService } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DateConverterModule } from '$shared/date-converter';
import { AppPageHeaderComponent } from '$shared/page-header';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    DateConverterModule,
    AppPageHeaderComponent,
  ],
})
export class ReportPageComponent implements AfterViewInit {
  @Input() report!: ReportDetails;

  reportService = inject(ReportService);

  async ngAfterViewInit() {
    console.log(this.report);
    if (this.report.isRead) {
      return;
    }

    await this.reportService.reportsReadPatchAsync({
      body: { id: this.report.id },
    });
  }

  generateStarRating(rating: number): string {
    const stars = '⭐'.repeat(rating);
    return stars;
  }
}
