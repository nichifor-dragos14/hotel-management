import { NgModule, inject } from '@angular/core';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsDummyComponent } from './reviews.dummy.component';
import { LoginService } from '$features/auth/login.service';

const REVIEW_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'reinit',
        component: ReviewsDummyComponent,
      },
      {
        path: 'my-reviews',
        component: ReviewsPageComponent,
        resolve: {
          userId: () => {
            const loginService = inject(LoginService);

            return loginService.getLoggedUserId();
          },
        },
        children: [],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(REVIEW_ROUTES)],
  exports: [RouterModule],
})
export class ReviewsModule {}
