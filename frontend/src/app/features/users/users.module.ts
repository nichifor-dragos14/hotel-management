import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from './user-profile/user-profile-page.component';
import { UserProfileDetailsPageComponent } from './user-profile-details/user-profile-details-page.component';
import { UserProfileStatisticsPageComponent } from './user-profile-statistics/user-profile-statistics-page.component';
import { UserProfileBookingsPageComponent } from './user-profile-bookings/user-profile-bookings-page.component';
import { UserProfilePreferencesPageComponent } from './user-profile-preferences/user-profile-preferences-page.component';

const USER_ROUTES: Routes = [
  {
    path: 'my-profile',
    component: UserProfilePageComponent,
    children: [
      {
        path: 'details',
        component: UserProfileDetailsPageComponent,
      },
      {
        path: 'preferences',
        component: UserProfilePreferencesPageComponent,
      },
      {
        path: 'bookings',
        component: UserProfileBookingsPageComponent,
      },
      {
        path: 'statistics',
        component: UserProfileStatisticsPageComponent,
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UserModule {}
