import { NgModule, inject } from '@angular/core';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ReportPageComponent } from './report-page/report-page.component';
import { ReportService } from '$backend/services';
import { DialogPageComponent } from '$shared/dialog-page';
import { CloseReportComponent } from './close-report.component';

const REPORT_ROUTES: Routes = [
  {
    path: '',
    component: ReportsPageComponent,
    children: [
      {
        path: ':id',
        component: ReportPageComponent,
        resolve: {
          report: async ({ params }: ActivatedRouteSnapshot) =>
            await inject(ReportService).reportsIdGetAsync({
              id: params['id'],
            }),
        },
        children: [
          {
            path: 'actions',
            component: DialogPageComponent,
            children: [
              {
                path: 'close',
                component: CloseReportComponent,
                resolve: {
                  id: ({ parent }: ActivatedRouteSnapshot) =>
                    parent?.parent?.params['id'],
                },
              },
            ],
          },
        ],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(REPORT_ROUTES)],
  exports: [RouterModule],
})
export class ReportsModule {}
