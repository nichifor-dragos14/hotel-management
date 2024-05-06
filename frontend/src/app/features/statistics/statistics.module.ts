import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterModule,
  Routes,
} from '@angular/router';
import { LoginService } from '$features/auth/login.service';
import { UserStatisticsPageComponent } from './user-statistics-page/user-statistics-page.component';
import { StatisticsService } from '$backend/services';
import { PropertyStatisticsPageComponent } from './property-statistics-page/property-statistics-page.component';

const STATISTICS_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'my-statistics',
        component: UserStatisticsPageComponent,
        resolve: {
          statistics: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const statisticsService = inject(StatisticsService);

            try {
              return await statisticsService.statisticsUserIdGetAsync({
                id: loginService.getLoggedUserId(),
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
      },
      {
        path: 'property/:id',
        component: PropertyStatisticsPageComponent,
        resolve: {
          statistics: async ({ params }: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const statisticsService = inject(StatisticsService);

            try {
              return await statisticsService.statisticsPropertyIdGetAsync({
                id: params['id'],
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          propertyId: async ({ params }: ActivatedRouteSnapshot) => {
            return params['id'];
          },
        },
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(STATISTICS_ROUTES)],
  exports: [RouterModule],
})
export class StatisticsModule {}
