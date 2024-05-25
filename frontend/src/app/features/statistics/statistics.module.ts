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
import { AuthGuard } from '$features/auth/auth.guard';
import { RoomStatisticsPageComponent } from './room-statistics-page/room-statistics-page.component';

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
        canActivate: [AuthGuard],
        data: {
          role: ['Client'],
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
        canActivate: [AuthGuard],
        data: {
          role: ['Owner'],
        },
      },
      {
        path: 'property/:propertyId/room/:roomId',
        component: RoomStatisticsPageComponent,
        resolve: {
          statistics: async ({ params }: ActivatedRouteSnapshot) => {
            const router = inject(Router);
            const statisticsService = inject(StatisticsService);

            try {
              return await statisticsService.statisticsRoomIdGetAsync({
                id: params['roomId'],
              });
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          propertyId: async ({ params }: ActivatedRouteSnapshot) => {
            return params['propertyId'];
          },
          roomId: async ({ params }: ActivatedRouteSnapshot) => {
            return params['roomId'];
          },
        },
        canActivate: [AuthGuard],
        data: {
          role: ['Owner'],
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
