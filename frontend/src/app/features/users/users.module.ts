import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from './user-profile/user-profile-page.component';
import { UserProfileDetailsPageComponent } from './user-profile-details/user-profile-details-page.component';
import { UserProfilePreferencesPageComponent } from './user-profile-preferences/user-profile-preferences-page.component';
import { UserProfileSecurityPageComponent } from './user-profile-security/user-profile-security-page.component';
import { LoginService } from '$features/auth/login.service';
import { UserService } from '$backend/services';
import { EditUserDetailsFormFactory } from './user-details.form';
import { EditUserPreferencesFormFactory } from './user-preferences.form';

const USER_ROUTES: Routes = [
  {
    path: 'my-profile',
    component: UserProfilePageComponent,
    children: [
      {
        path: 'details',
        component: UserProfileDetailsPageComponent,
        resolve: {
          userForm: async () => {
            let email = inject(LoginService).getLoggedUserEmail();

            const editUserDetailsFormFactory = inject(
              EditUserDetailsFormFactory
            );

            let user = await inject(UserService).usersEmailGetAsync({
              email,
            });

            return editUserDetailsFormFactory.build(user);
          },
        },
      },
      {
        path: 'preferences',
        component: UserProfilePreferencesPageComponent,
        resolve: {
          userForm: async () => {
            let email = inject(LoginService).getLoggedUserEmail();

            const editUserPreferencesFormFactory = inject(
              EditUserPreferencesFormFactory
            );

            var user = await inject(UserService).usersEmailGetAsync({
              email,
            });

            return editUserPreferencesFormFactory.build(user);
          },
        },
      },
      {
        path: 'security',
        component: UserProfileSecurityPageComponent,
        resolve: {
          user: async () => {
            let email = inject(LoginService).getLoggedUserEmail();

            return await inject(UserService).usersEmailGetAsync({
              email,
            });
          },
        },
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UserModule {}
