import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { UserStatistics } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppPageHeaderComponent } from '$shared/page-header';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-user-statistics-page',
  templateUrl: './user-statistics-page.component.html',
  styleUrls: ['./user-statistics-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    AppPageHeaderComponent,
    CanvasJSAngularChartsModule,
    MatListModule,
    MatTabsModule,
  ],
})
export class UserStatisticsPageComponent implements OnInit {
  cdr = inject(ChangeDetectorRef);

  @Input() statistics!: UserStatistics;

  bookingsByMonthChartOptions: any;
  xpByMonthChartOptions: any;

  ngOnInit() {
    this.initializeBookingsByMonthChart();
    this.initializeXpByMonthChart();
  }

  initializeBookingsByMonthChart() {
    this.bookingsByMonthChartOptions = {
      height: 350,
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      title: {
        text: 'Your bookings each month',
      },
      axisX: {
        valueFormatString: 'MMM',
        interval: 1,
        intervalType: 'month',
        labelAngle: -30,
        titleFontColor: '#7F6084',
        labelFontColor: '#7F6084',
      },
      axisY: {
        title: 'Bookings',
        titleFontColor: '#7F6084',
        labelFontColor: '#7F6084',
        gridThickness: 1,
      },
      data: [
        {
          type: 'line',
          lineThickness: 2,
          color: '#F08080',
          markerType: 'circle',
          markerColor: '#4F81BC',
          markerSize: 8,
          dataPoints: this.statistics.bookingsByMonth.map((bm) => ({
            x: new Date(bm.year, bm.month - 1, 1),
            y: bm.bookingCount,
          })),
          toolTipContent: '{x}: {y} bookings',
          dataLabels: {
            enabled: true,
            color: '#4F81BC',
            font: '14px Arial',
          },
        },
      ],
    };
  }

  initializeXpByMonthChart() {
    this.xpByMonthChartOptions = {
      height: 350,
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      title: {
        text: 'Your XP gained each month',
      },
      axisX: {
        valueFormatString: 'MMM',
        interval: 1,
        intervalType: 'month',
        labelAngle: -30,
        titleFontColor: '#7F6084',
        labelFontColor: '#7F6084',
      },
      axisY: {
        title: 'XP',
        titleFontColor: '#7F6084',
        labelFontColor: '#7F6084',
        gridThickness: 1,
      },
      data: [
        {
          type: 'column',
          lineThickness: 2,
          color: '#F08080',
          markerType: 'circle',
          markerColor: '#4F81BC',
          markerSize: 8,
          dataPoints: this.statistics.xpByMonth.map((bm) => ({
            x: new Date(bm.year, bm.month - 1, 1),
            y: bm.totalXP,
          })),
          toolTipContent: '{x}: {y} XP',
          dataLabels: {
            enabled: true,
            color: '#4F81BC',
            font: '14px Arial',
          },
        },
      ],
    };
  }
}
