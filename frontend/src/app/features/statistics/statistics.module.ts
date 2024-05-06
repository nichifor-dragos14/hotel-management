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
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(STATISTICS_ROUTES)],
  exports: [RouterModule],
})
export class StatisticsModule {}
