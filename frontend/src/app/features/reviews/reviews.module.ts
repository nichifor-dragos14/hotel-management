import { NgModule, inject } from '@angular/core';
import { ReviewsPageComponent } from './reviews-page/reviews-page.component';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ReviewsDummyComponent } from './reviews.dummy.component';
import { LoginService } from '$features/auth/login.service';
import { UpdateReviewPageComponent } from './update-review/update-review.component';
import { ReviewService } from '$backend/services';
import { UpdateReviewFormFactory } from './update-review.form';

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
        children: [
          {
            path: ':id',
            component: UpdateReviewPageComponent,
            resolve: {
              reviewForm: async ({ params }: ActivatedRouteSnapshot) => {
                const reviewService = inject(ReviewService);

                let updateReviewFormFactory = new UpdateReviewFormFactory();

                let review = await reviewService.reviewsIdGetAsync({
                  id: params['id'],
                });

                return updateReviewFormFactory.build({
                  description: review.description,
                  id: review.id,
                  title: review.title,
                  rating: review.rating,
                });
              },
            },
          },
        ],
      },
    ],
  },
] satisfies Routes;

@NgModule({
  imports: [RouterModule.forChild(REVIEW_ROUTES)],
  exports: [RouterModule],
})
export class ReviewsModule {}
