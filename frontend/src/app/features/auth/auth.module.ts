import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/login-page.component';
import { RegisterPageComponent } from './register/register-page.component';

const AUTHENTICATION_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(AUTHENTICATION_ROUTES)],
  exports: [RouterModule],
})
export class AuthModule {}
