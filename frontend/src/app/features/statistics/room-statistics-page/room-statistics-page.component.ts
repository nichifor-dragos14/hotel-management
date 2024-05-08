import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { PropertyStatistics } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AppPageHeaderComponent } from '$shared/page-header';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-room-statistics-page',
  templateUrl: './room-statistics-page.component.html',
  styleUrls: ['./room-statistics-page.component.scss'],
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
export class RoomStatisticsPageComponent implements OnInit {
  readonly cdr = inject(ChangeDetectorRef);

  @Input() statistics!: PropertyStatistics;
  @Input() propertyId!: string;
  @Input() roomId!: string;

  numberOfBookingsAndTotalRevenueMonthly: any;
  totalRevenueChartOptions: any;
  reviewPieOptions: any;

  pieArray: any;

  ngOnInit() {
    this.initializeNumberOfBookingsAndTotalRevenueMonthlyChart();
    this.initializeTotalRevenueChart();
  }

  initializeNumberOfBookingsAndTotalRevenueMonthlyChart() {
    this.numberOfBookingsAndTotalRevenueMonthly = {
      height: 350,
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      title: {
        text: 'Bookings and occupancy rate each month',
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
        titleFontColor: '#7F6084',
        labelFontColor: '#7F6084',
        gridThickness: 1,
      },
      data: [
        {
          type: 'column',
          lineThickness: 2,
          color: '#0000FF',
          markerType: 'circle',
          markerColor: '#4F81BC',
          markerSize: 8,
          dataPoints: this.statistics.monthlyStatistics.map((bm) => ({
            x: new Date(bm.year, bm.month - 1, 1),
            y: bm.numberOfBookings,
          })),
          toolTipContent: '{x}: {y} bookings',
          dataLabels: {
            enabled: true,
            color: '#4F81BC',
            font: '14px Arial',
          },
        },
        {
          type: 'column',
          lineThickness: 2,
          color: '#F08080',
          markerType: 'circle',
          markerColor: '#4F81BC',
          markerSize: 8,
          dataPoints: this.statistics.monthlyStatistics.map((bm) => ({
            x: new Date(bm.year, bm.month - 1, 1),
            y: bm.occupancyRate,
          })),
          toolTipContent: '{x}: {y} occupancy rate',
          dataLabels: {
            enabled: true,
            color: '#4F81BC',
            font: '14px Arial',
          },
        },
      ],
    };
  }

  initializeTotalRevenueChart() {
    this.totalRevenueChartOptions = {
      height: 350,
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      panEnabled: true,
      title: {
        text: 'Total revenue each month',
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
          dataPoints: this.statistics.monthlyStatistics.map((bm) => ({
            x: new Date(bm.year, bm.month - 1, 1),
            y: bm.totalRevenue,
          })),
          toolTipContent: '{x}: {y} lei',
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
