import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
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
        runGuardsAndResolvers: 'always',
        resolve: {
          userForm: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const userService = inject(UserService);

            try {
              const email = loginService.getLoggedUserEmail();

              const editUserDetailsFormFactory = inject(
                EditUserDetailsFormFactory
              );

              const user = await userService.usersEmailGetAsync({
                email,
              });

              return editUserDetailsFormFactory.build(user);
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
          user: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const userService = inject(UserService);

            try {
              const email = loginService.getLoggedUserEmail();

              const user = await userService.usersEmailGetAsync({
                email,
              });

              return user;
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
      },
      {
        path: 'preferences',
        component: UserProfilePreferencesPageComponent,
        resolve: {
          userForm: async () => {
            const router = inject(Router);
            const loginService = inject(LoginService);
            const userService = inject(UserService);

            const editUserPreferencesFormFactory = inject(
              EditUserPreferencesFormFactory
            );

            try {
              const email = loginService.getLoggedUserEmail();

              const user = await userService.usersEmailGetAsync({
                email,
              });

              return editUserPreferencesFormFactory.build(user);
            } catch (error) {
              router.navigate(['/error']);

              return null;
            }
          },
        },
      },
      {
        path: 'security',
        component: UserProfileSecurityPageComponent,
        resolve: {
          user: async () => {
            const router = inject(Router);
            const userService = inject(UserService);
            const loginService = inject(LoginService);

            try {
              const email = loginService.getLoggedUserEmail();

              return await userService.usersEmailGetAsync({
                email,
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
  imports: [RouterModule.forChild(USER_ROUTES)],
  exports: [RouterModule],
})
export class UserModule {}
