import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from './user-profile/user-profile-page.component';
import { UserProfileDetailsPageComponent } from './user-profile-details/user-profile-details-page.component';
import { UserProfilePreferencesPageComponent } from './user-profile-preferences/user-profile-preferences-page.component';
import { UserProfileSecurityPageComponent } from './user-profile-security/user-profile-security-page.component';
import { LoginService } from '$features/auth/login.service';
import { UpdateUserDetailsCommand, UserService } from '$backend/services';
import { EditUserDetailsFormFactory } from './user-details.form';
import { UpdatePropertyPageComponent } from '$features/properties/update-property/update-property.component';
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
            let claims = inject(LoginService).decodeToken();

            if (claims == null) {
              return;
            }

            const editUserDetailsFormFactory = inject(
              EditUserDetailsFormFactory
            );

            let user = await inject(UserService).usersEmailGetAsync({
              email: claims['emailaddress'],
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
            let claims = inject(LoginService).decodeToken();

            if (claims == null) {
              return;
            }

            const editUserPreferencesFormFactory = inject(
              EditUserPreferencesFormFactory
            );

            var user = await inject(UserService).usersEmailGetAsync({
              email: claims['emailaddress'],
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
            let claims = inject(LoginService).decodeToken();

            if (claims == null) {
              return;
            }

            return await inject(UserService).usersEmailGetAsync({
              email: claims['emailaddress'],
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
