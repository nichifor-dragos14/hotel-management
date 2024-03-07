import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReportDetails } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DateConverterModule } from '$shared/date-converter';

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
  ],
})
export class ReportPageComponent {
  @Input() report!: ReportDetails;
}
