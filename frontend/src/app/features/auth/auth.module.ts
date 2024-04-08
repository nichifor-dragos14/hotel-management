import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/login-page.component';

const MAIN_PAGE_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(MAIN_PAGE_ROUTES)],
  exports: [RouterModule],
})
export class AuthModule {}
