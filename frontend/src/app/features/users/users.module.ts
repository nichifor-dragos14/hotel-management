import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from './user-profile/user-profile-page.component';
import { UserProfileDetailsPageComponent } from './user-profile-details/user-profile-details-page.component';
import { UserProfilePreferencesPageComponent } from './user-profile-preferences/user-profile-preferences-page.component';
import { UserProfileSecurityPageComponent } from './user-profile-security/user-profile-security-page.component';

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
        path: 'security',
        component: UserProfileSecurityPageComponent,
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UserModule {}
