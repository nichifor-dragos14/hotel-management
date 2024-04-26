import { NgModule, inject } from '@angular/core';
import { ReportsPageComponent } from './reports-page/reports-page.component';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { ReportPageComponent } from './report-page/report-page.component';
import { ReportService } from '$backend/services';
import { DialogPageComponent } from '$shared/dialog-page';
import { CloseReportComponent } from './close-report.component';
import { OpenReportComponent } from './open-report.component';
import { ReportsDummyComponent } from './reports.dummy.component';
import { AuthGuard } from '$features/auth/auth.guard';

const REPORT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: ReportsDummyComponent,
      },
      {
        path: 'admin',
        component: ReportsPageComponent,
        children: [
          {
            path: ':id',
            component: ReportPageComponent,
            resolve: {
              report: async ({ params }: ActivatedRouteSnapshot) => {
                const router = inject(Router);
                const reportService = inject(ReportService);

                try {
                  return await reportService.reportsIdGetAsync({
                    id: params['id'],
                  });
                } catch (error) {
                  router.navigate(['/error']);

                  return null;
                }
              },
            },
            canActivate: [AuthGuard],
            data: {
              role: 'Admin',
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
                      id: ({ parent }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);

                        if (parent?.parent?.params['id']) {
                          return parent?.parent?.params['id'];
                        } else {
                          router.navigate(['/error']);

                          return null;
                        }
                      },
                    },
                    canActivate: [AuthGuard],
                    data: {
                      role: 'Admin',
                    },
                  },
                  {
                    path: 'open',
                    component: OpenReportComponent,
                    resolve: {
                      id: ({ parent }: ActivatedRouteSnapshot) => {
                        const router = inject(Router);

                        if (parent?.parent?.params['id']) {
                          return parent?.parent?.params['id'];
                        } else {
                          router.navigate(['/error']);

                          return null;
                        }
                      },
                    },
                    canActivate: [AuthGuard],
                    data: {
                      role: 'Admin',
                    },
                  },
                ],
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
